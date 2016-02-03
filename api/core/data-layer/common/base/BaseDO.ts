export abstract class BaseDO {
	protected abstract getPrimitiveProperties(): string[];

	public buildFromObject(object: Object) {
		if (!object) {
			return;
		}
		var primitiveProperties: string[] = this.getPrimitiveProperties();
		for (var property in primitiveProperties) {
			if (object.hasOwnProperty(property)) {
                this[property] = object[property];
            }
		}
	}
}