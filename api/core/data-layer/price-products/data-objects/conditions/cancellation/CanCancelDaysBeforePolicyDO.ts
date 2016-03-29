import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy} from './IPriceProductCancellationPolicy';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';

export class CanCancelDaysBeforePolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	daysBefore: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["daysBefore"];
	}

	public hasCancellationPolicy(): boolean {
		return true;
	}
	public isValid(): boolean {
		var rule = NumberValidationRule.buildIntegerNumberRule(0);
		return rule.validate(this.daysBefore).isValid();
	}
}