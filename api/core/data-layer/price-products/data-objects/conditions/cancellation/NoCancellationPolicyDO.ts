import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {IPriceProductCancellationPolicy, PolicyTriggerTimeParams} from './IPriceProductCancellationPolicy';
import {CancellationPolicyUtils} from './utils/CancellationPolicyUtils';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThHourDO} from '../../../../../utils/th-dates/data-objects/ThHourDO';
import {BookingStateChangeTriggerTimeDO, BookingStateChangeTriggerType} from '../../../../bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';

export class NoCancellationPolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public hasCancellationPolicy(): boolean {
		return false;
	}
	public isValid(): boolean {
		return true;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Can cancel whenever");
	}

	public generateGuaranteedTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO {
		var triggerTime = new BookingStateChangeTriggerTimeDO();
		triggerTime.type = BookingStateChangeTriggerType.Never;
		return triggerTime;
	}
	public generateNoShowTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO {
		var ccUtils = new CancellationPolicyUtils();
		return ccUtils.generateStateChangeTriggerTimeDO(BookingStateChangeTriggerType.DependentOnCancellationHour, triggerParams.arrivalDate, ThHourDO.buildThHourDO(0, 0));
	}
}