import {ErrorCode, ResponseWrapper} from '../../core/utils/responses/ResponseWrapper';
import {ErrorParser} from '../../core/utils/responses/ErrorParser';
import {Logger} from '../../core/utils/logging/Logger';

import _ = require("underscore");

export class BaseController {
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
			if (!this.objectContainsParameter(req[reqField], parameter)) {
				result = false;
			}
		});
		if (!result) {
			Logger.getInstance().logError("Invalid request parameters", { url: req.url, actualParameters: req[reqField], requiredParameters: parameters }, new Error());
			var responseWrapper: ResponseWrapper = new ResponseWrapper(ErrorCode.InvalidRequestParameters);
			this.returnResponse(req, res, responseWrapper);
			return false;
		}
		return true;
	}
	private objectContainsParameter(object: Object, parameter: string): boolean {
		var currentObject = object;
		var parameterStack: string[] = parameter.split(".");
		for (var i = 0; i < parameterStack.length; i++) {
			var param = parameterStack[i];
			currentObject = currentObject[param];
			if (currentObject === undefined) {
				return false;
			}
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
			Logger.getInstance().logError("Uncatched error", { url: req.url, body: req.body, query: req.query }, error);
		}
		this.returnResponse(req, res, errorParser.getResponseWrapper());
	}

	private returnResponse(req: Express.Request, res: Express.Response, responseWrapper: ResponseWrapper) {
		return res.json(responseWrapper.buildJson(req.sessionContext.locale));
	}
}