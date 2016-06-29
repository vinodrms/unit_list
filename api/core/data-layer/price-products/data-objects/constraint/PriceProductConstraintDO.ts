import {BaseDO} from '../../../common/base/BaseDO';
import {ThTranslation} from '../../../../utils/localization/ThTranslation';
import {PriceProductConstraintType, PriceProductConstraintDataDO, IPriceProductConstraint} from './IPriceProductConstraint';
import {PriceProductConstraintFactory} from './PriceProductConstraintFactory';

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

	public appliesOn(data: PriceProductConstraintDataDO): boolean {
		return this.constraint.appliesOn(data);
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		return this.constraint.getValueDisplayString(thTranslation);
	}
}