import _ = require("underscore");

export abstract class BaseDO {
	protected abstract getPrimitivePropertyKeys(): string[];

	public buildFromObject(object: Object) {
		if (!object) {
			return;
		}
		var primitiveProperties: string[] = this.getPrimitivePropertyKeys();
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