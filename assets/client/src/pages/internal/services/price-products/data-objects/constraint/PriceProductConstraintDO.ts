import {BaseDO} from '../../../../../../common/base/BaseDO';
import {PriceProductConstraintType, IPriceProductConstraint} from './IPriceProductConstraint';
import {PriceProductConstraintFactory} from './PriceProductConstraintFactory';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

export class PriceProductConstraintDO extends BaseDO implements IPriceProductConstraint {
	type: PriceProductConstraintType;
	constraint: IPriceProductConstraint;

	protected getPrimitivePropertyKeys(): string[] {
		return ["type"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		var constraintFactory = new PriceProductConstraintFactory();
		this.constraint = constraintFactory.getConstraintByType(this.type);
		this.constraint.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "constraint"));
	}
	public isValid() {
		return this.constraint.isValid();
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return this.constraint.getValueDisplayString(thTranslation);
	}
}