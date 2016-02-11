import {ThLogger, ThLogLevel} from '../../core/utils/logging/ThLogger';
import {ThError} from '../../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../../core/utils/th-responses/ThResponse';
import {ThUtils} from '../../core/utils/ThUtils';
import {SessionContext} from '../../core/utils/SessionContext';

import _ = require("underscore");

export class BaseController {
	protected precheckPOSTParameters(req: Express.Request, res: Express.Response, rootParameter: string, parameters: string[]): boolean {
		var parameterArray = [rootParameter];
		parameters.forEach((parameter: string) => {
			parameterArray.push(rootParameter + "." + parameter);
		});
		return this.precheckParameters(req, res, "body", parameterArray);
	}
	protected precheckGETParameters(req: Express.Request, res: Express.Response, parameters: string[]): boolean {
		return this.precheckParameters(req, res, "query", parameters);
	}
	private precheckParameters(req: Express.Request, res: Express.Response, reqField: string, parameters: string[]): boolean {
		var result = true;
		var thUtils: ThUtils = new ThUtils();
		parameters.forEach((parameter: string) => {
			if (thUtils.isUndefinedOrNull(req[reqField], parameter)) {
				result = false;
			}
		});
		if (!result) {
			var thError = new ThError(ThStatusCode.InvalidRequestParameters, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Invalid request parameters", { url: req.url, actualParameters: req[reqField], requiredParameters: parameters }, thError);
			var thResponse: ThResponse = new ThResponse(thError.getThStatusCode());
			this.returnResponse(req, res, thResponse);
			return false;
		}
		return true;
	}

	protected returnSuccesfulResponse(req: Express.Request, res: Express.Response, data: any) {
		var thResponse = new ThResponse(ThStatusCode.Ok, data);
		this.returnResponse(req, res, thResponse);
	}
	protected returnErrorResponse(req: Express.Request, res: Express.Response, error: any, defaultErrorCode: ThStatusCode) {
		var thError = new ThError(defaultErrorCode, error);
		if (thError.isNativeError()) {
			ThLogger.getInstance().logError(ThLogLevel.Error, "Native Uncaught Error", { url: req.url, body: req.body, query: req.query }, thError);
		}
		this.returnResponse(req, res, new ThResponse(thError.getThStatusCode()));
	}

	private returnResponse(req: Express.Request, res: Express.Response, thResponse: ThResponse) {
		var sessionContext: SessionContext = req.sessionContext;
		return res.json(thResponse.buildJson(sessionContext.language));
	}
}