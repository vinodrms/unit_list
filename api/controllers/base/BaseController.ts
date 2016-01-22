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
}