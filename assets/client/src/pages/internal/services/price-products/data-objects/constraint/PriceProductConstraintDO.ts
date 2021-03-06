import {BaseDO} from '../../../../../../common/base/BaseDO';
import {PriceProductConstraintType, IPriceProductConstraint} from './IPriceProductConstraint';
import {PriceProductConstraintFactory} from './PriceProductConstraintFactory';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';
import {IPriceProductValidationRule, PriceProductValidationRuleDataDO, PriceProductValidationRuleResult} from './validation/IPriceProductValidationRule';

export class PriceProductConstraintDO extends BaseDO implements IPriceProductConstraint, IPriceProductValidationRule {
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
	public getBriefValueDisplayString(thTranslation: ThTranslation): string {
		var constraintFactory = new PriceProductConstraintFactory();
		var constraintMeta = constraintFactory.getPriceProductConstraintMetaByType(this.type);
		return thTranslation.translate(constraintMeta.brief) + " " + this.constraint.getBriefValueDisplayString(thTranslation);
	}

	public appliesOn(data: PriceProductValidationRuleDataDO): PriceProductValidationRuleResult {
		var constraintFactory = new PriceProductConstraintFactory();
		var constraintRule = constraintFactory.getValidationRuleByType(this.type, this.constraint);
		return constraintRule.appliesOn(data);
	}
}