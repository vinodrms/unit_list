import {ErrorCode, ResponseWrapper} from '../../core/utils/responses/ResponseWrapper';
import {ErrorParser} from '../../core/utils/responses/ErrorParser';
import {Logger, LogLevel} from '../../core/utils/logging/Logger';
import {AppUtils} from '../../core/utils/AppUtils';

import _ = require("underscore");

export class BaseController {
	protected _appUtils: AppUtils;
	contructor() {
		this._appUtils = new AppUtils();
	}
	protected precheckPOSTParameters(req: Express.Request, res: Express.Response, rootParameter: string, parameters: string[]): boolean {
		var parameterArray = [rootParameter];
		for (var parameter in parameters) {
			parameterArray.push(rootParameter + "." + parameter);
		}
		return this.precheckParameters(req, res, "body", parameterArray);
	}
	protected precheckGETParameters(req: Express.Request, res: Express.Response, parameters: string[]): boolean {
		return this.precheckParameters(req, res, "query", parameters);
	}
	private precheckParameters(req: Express.Request, res: Express.Response, reqField: string, parameters: string[]): boolean {
		var result = true;
		parameters.forEach((parameter: string) => {
			if (this._appUtils.isUndefined(req[reqField], parameter)) {
				result = false;
			}
		});
		if (!result) {
			Logger.getInstance().logBusiness(LogLevel.Error, "Invalid request parameters", { url: req.url, actualParameters: req[reqField], requiredParameters: parameters });
			var responseWrapper: ResponseWrapper = new ResponseWrapper(ErrorCode.InvalidRequestParameters);
			this.returnResponse(req, res, responseWrapper);
			return false;
		}
		return true;
	}

	protected returnSuccesfulResponse(req: Express.Request, res: Express.Response, data: any) {
		var responseWrapper = new ResponseWrapper(ErrorCode.Ok, data);
		this.returnResponse(req, res, responseWrapper);
	}
	protected returnErrorResponse(req: Express.Request, res: Express.Response, error: any, defaultErrorCode: ErrorCode) {
		var errorParser: ErrorParser = new ErrorParser(error, defaultErrorCode);
		if (errorParser.isUncatchedError()) {
			Logger.getInstance().logError(LogLevel.Error, "Uncatched error", { url: req.url, body: req.body, query: req.query }, error);
		}
		this.returnResponse(req, res, errorParser.getResponseWrapper());
	}

	private returnResponse(req: Express.Request, res: Express.Response, responseWrapper: ResponseWrapper) {
		return res.json(responseWrapper.buildJson(req.sessionContext.locale));
	}
}