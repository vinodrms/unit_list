import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy, PolicyTriggerTimeParams} from './IPriceProductCancellationPolicy';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {CancellationPolicyUtils} from './utils/CancellationPolicyUtils';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateUtils} from '../../../../../utils/th-dates/ThDateUtils';
import {ThHourDO} from '../../../../../utils/th-dates/data-objects/ThHourDO';
import {BookingStateChangeTriggerTimeDO, BookingStateChangeTriggerType} from '../../../../bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';

export class NoCancellationPossiblePolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public hasCancellationPolicy(): boolean {
		return true;
	}
	public isValid(): boolean {
		return true;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("No cancellation possible");
	}

	public generateGuaranteedTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO {
		var ccUtils = new CancellationPolicyUtils();
		var minDate: ThDateDO = ccUtils.thDateUtils.getMinThDateDO();
		return ccUtils.generateStateChangeTriggerTimeDO(BookingStateChangeTriggerType.ExactTimestamp, minDate, ThHourDO.buildThHourDO(0, 0));
	}
	public generateNoShowTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO {
		var ccUtils = new CancellationPolicyUtils();
		return ccUtils.generateMidnightStateChangeTriggerTimeDO(triggerParams.arrivalDate);
	}
}