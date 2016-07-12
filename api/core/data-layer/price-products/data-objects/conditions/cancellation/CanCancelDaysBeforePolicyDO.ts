import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {IPriceProductCancellationPolicy, PolicyTriggerTimeParams} from './IPriceProductCancellationPolicy';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';
import {CancellationPolicyUtils} from './utils/CancellationPolicyUtils';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThHourDO} from '../../../../../utils/th-dates/data-objects/ThHourDO';
import {ThDateUtils} from '../../../../../utils/th-dates/ThDateUtils';
import {BookingStateChangeTriggerTimeDO, BookingStateChangeTriggerType} from '../../../../bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';

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
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Can cancel %daysBefore% days before arrival", { daysBefore: this.daysBefore });
	}

	public generateGuaranteedTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO {
		var ccUtils = new CancellationPolicyUtils();
		var cancelDateDO = triggerParams.arrivalDate.buildPrototype();
		cancelDateDO = ccUtils.thDateUtils.addDaysToThDateDO(cancelDateDO, (-1 * this.daysBefore));
		return ccUtils.generateStateChangeTriggerTimeDO(BookingStateChangeTriggerType.DependentOnCancellationHour, cancelDateDO, ThHourDO.buildThHourDO(0, 0));
	}
	public generateNoShowTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO {
		var ccUtils = new CancellationPolicyUtils();
		return ccUtils.generateMidnightStateChangeTriggerTimeDO(triggerParams.arrivalDate);
	}
}