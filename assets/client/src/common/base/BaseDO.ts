import { ThUtils } from '../utils/ThUtils';

import * as _ from "underscore";

var thUtils: ThUtils = new ThUtils();

export abstract class BaseDO {
	protected abstract getPrimitivePropertyKeys(): string[];

	protected getObjectPropertyEnsureUndefined(object: Object, propertyName: string): Object {
		if (thUtils.isUndefinedOrNull(object) || thUtils.isUndefinedOrNull(object[propertyName])) {
			return null;
		}
		return object[propertyName];
	}
	public buildFromObject(object: Object) {
		if (thUtils.isUndefinedOrNull(object)) {
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