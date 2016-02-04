import _ = require("underscore");

export abstract class BaseDO {
	protected abstract getPrimitiveProperties(): string[];

	public buildFromObject(object: Object) {
		if (!object) {
			return;
		}
		var primitiveProperties: string[] = this.getPrimitiveProperties();
		primitiveProperties.forEach((property: string) => {
			if (object.hasOwnProperty(property)) {
				this[property] = object[property];
			}
		});
	}
	protected forEachElementOf(list: any, iteratee: { (element: Object): void; }) {
		if (!_.isArray(list)) {
			return;
		}
		list.forEach((element: Object) => {
			iteratee(element);
		});
	}
}