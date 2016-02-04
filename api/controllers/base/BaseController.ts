import {ResponseWrapper, ResponseStatusCode} from '../../core/utils/responses/ResponseWrapper';

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
			var wrapper = new ResponseWrapper(ResponseStatusCode.InvalidRequestParameters);
			this.returnResponse(req, res, wrapper);
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

	protected returnResponse(req: Express.Request, res: Express.Response, wrapper: ResponseWrapper) {
		res.json(wrapper.buildResponse(req.sessionContext.locale));
	}
}