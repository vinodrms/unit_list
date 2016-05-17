import {BaseDO} from '../../../../../../common/base/BaseDO';
import {AllotmentConstraintType, IAllotmentConstraint} from './IAllotmentConstraint';
import {AllotmentConstraintFactory} from './AllotmentConstraintFactory';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';

export class AllotmentConstraintDO extends BaseDO implements IAllotmentConstraint {
	type: AllotmentConstraintType;
	constraint: IAllotmentConstraint;

	protected getPrimitivePropertyKeys(): string[] {
		return ["type"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		var constraintFactory = new AllotmentConstraintFactory();
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