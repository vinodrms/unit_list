import {BaseDO} from '../../../../../../common/base/BaseDO';
import {IPriceProductConstraint} from './IPriceProductConstraint';
import {PriceProductConstraintDO} from './PriceProductConstraintDO';
import {ThTranslation} from '../../../../../../common/utils/localization/ThTranslation';
import {IPriceProductValidationRule, PriceProductValidationRuleDataDO, PriceProductValidationRuleResult} from './validation/IPriceProductValidationRule';

import * as _ from "underscore";

export class PriceProductConstraintWrapperDO extends BaseDO implements IPriceProductConstraint, IPriceProductValidationRule {
	constraintList: PriceProductConstraintDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.constraintList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "constraintList"), (constraintObject: Object) => {
			var constraintDO = new PriceProductConstraintDO();
			constraintDO.buildFromObject(constraintObject);
			this.constraintList.push(constraintDO);
		});
	}

	public isValid(): boolean {
		var isValid = true;
		_.forEach(this.constraintList, (constraint: PriceProductConstraintDO) => {
			if (!constraint.isValid()) {
				isValid = false;
			}
		});
		return isValid;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return "";
	}

	public getBriefValueDisplayString(thTranslation: ThTranslation): string {
		var briefValue = "";
		_.forEach(this.constraintList, (constraint: PriceProductConstraintDO) => {
			if (briefValue.length > 0) { briefValue = briefValue + ", "; };
			briefValue = briefValue + constraint.getBriefValueDisplayString(thTranslation);
		});
		if (briefValue.length == 0) { briefValue = "n/a"; };
		return briefValue;
	}

	public appliesOn(data: PriceProductValidationRuleDataDO): PriceProductValidationRuleResult {
		var validationResult: PriceProductValidationRuleResult = {
			valid: true,
			errorMessage: ""
		}
		_.forEach(this.constraintList, (constraint: PriceProductConstraintDO) => {
			var constraintValidationResult = constraint.appliesOn(data);
			if (!constraintValidationResult.valid) {
				validationResult.valid = false;
				if (validationResult.errorMessage.length > 0) { validationResult.errorMessage += ", "; };
				validationResult.errorMessage += constraintValidationResult.errorMessage;
			}
		});
		return validationResult;
	}
}