import {ResponseWrapper, ResponseStatusCode} from '../../core/utils/responses/ResponseWrapper';

export class BaseController {
	protected _exportedMethods: string[] = [];

	public exports(): any {
		// Merge default array and custom array from child.
		var methods: any = this._exportedMethods;
		var exportedMethods: any = {};

		for (var i = 0; i < methods.length; i++) {
			// Check if the method exists.
			if (typeof this[methods[i]] !== 'undefined') {
				// Check that the method shouldn't be private. (Exception for _config, which is a sails config)
				if (methods[i][0] !== '_' || methods[i] === '_config') {
					if (_.isFunction(this[methods[i]])) {
						exportedMethods[methods[i]] = this[methods[i]].bind(this);
					} else {
						exportedMethods[methods[i]] = this[methods[i]];
					}
				} else {
					console.error('The method "' + methods[i] + '" is not public and cannot be exported. ' + this);
				}
			} else {
				console.error('The method "' + methods[i] + '" does not exist on the controller ' + this);
			}
		}

		return exportedMethods;
	}

	protected _inputPOSTParametersExist(req: Express.Request, res: Express.Response, rootParameter: string, parameters: string[]): boolean {
		var parameterArray = [rootParameter];
		for(var parameter in parameters) {
			parameterArray.push(rootParameter + "." + parameter);
		}
		return this._inputParametersExist(req, res, "body", parameterArray);
	}
	protected _inputGETParametersExist(req: Express.Request, res: Express.Response, parameters: string[]): boolean {
		return this._inputParametersExist(req, res, "query", parameters);
	}
	private _inputParametersExist(req: Express.Request, res: Express.Response, reqField: string, parameters: string[]): boolean {
		var result = true;
		parameters.forEach((parameter: string) => {
			if (!this._objectContainsParameter(req[reqField], parameter)) {
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
	private _objectContainsParameter(object: Object, parameter: string): boolean {
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
	
	protected returnResponse(req: Express.Request, res: Express.Response, wrapper : ResponseWrapper) {
		res.json(wrapper.buildResponse(req.sessionContext.locale));
	}
}