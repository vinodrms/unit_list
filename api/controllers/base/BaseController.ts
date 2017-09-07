import { ThLogger, ThLogLevel } from '../../core/utils/logging/ThLogger';
import { ThError } from '../../core/utils/th-responses/ThError';
import { ThStatusCode, ThResponse } from '../../core/utils/th-responses/ThResponse';
import { ThUtils } from '../../core/utils/ThUtils';
import { SessionContext } from '../../core/utils/SessionContext';
import { ThTranslation } from '../../core/utils/localization/ThTranslation';

import _ = require("underscore");

export class BaseController {
	protected precheckPOSTParameters(req: any, res: any, rootParameter: string, parameters: string[]): boolean {
		var parameterArray = [rootParameter];
		parameters.forEach((parameter: string) => {
			parameterArray.push(rootParameter + "." + parameter);
		});
		return this.precheckParameters(req, res, "body", parameterArray);
	}
	protected precheckGETParameters(req: any, res: any, parameters: string[]): boolean {
		return this.precheckParameters(req, res, "query", parameters);
	}
	private precheckParameters(req: any, res: any, reqField: string, parameters: string[]): boolean {
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

	protected returnSuccesfulResponse(req: any, res: any, data: any) {
		var thResponse = new ThResponse(ThStatusCode.Ok, data);
		this.returnResponse(req, res, thResponse);
	}
	protected returnErrorResponse(req: any, res: any, error: any, defaultErrorCode: ThStatusCode, httpCode?: number) {
		var thError = new ThError(defaultErrorCode, error);
		if (thError.isNativeError()) {
			ThLogger.getInstance().logError(ThLogLevel.Error, "Native Uncaught Error", { url: req.url, body: req.body, query: req.query }, thError);
		}
		this.returnResponse(req, res, new ThResponse(thError.getThStatusCode()));
	}
	protected returnHttpErrorResponse(req: any, res: any, httpCode: number, message: string) {
		res.statusCode = httpCode;
		return res.json({
			message: message
		});
	}

	private returnResponse(req: any, res: any, thResponse: ThResponse) {
		var sessionContext: SessionContext = req.sessionContext;
		return res.json(thResponse.buildJson(sessionContext.language));
	}

	protected getThTranslation(sessionContext: SessionContext): ThTranslation {
		return new ThTranslation(sessionContext.language);
	}
}