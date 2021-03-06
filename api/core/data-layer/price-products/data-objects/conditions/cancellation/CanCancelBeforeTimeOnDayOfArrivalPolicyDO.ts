import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {IPriceProductCancellationPolicy, PolicyTriggerTimeParams} from './IPriceProductCancellationPolicy';
import {ThHourDO} from '../../../../../utils/th-dates/data-objects/ThHourDO';
import {CancellationPolicyUtils} from './utils/CancellationPolicyUtils';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {BookingStateChangeTriggerTimeDO, BookingStateChangeTriggerType} from '../../../../bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';

export class CanCancelBeforeTimeOnDayOfArrivalPolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	timeOfArrival: ThHourDO;

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.timeOfArrival = new ThHourDO();
		this.timeOfArrival.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "timeOfArrival"));
	}

	public hasCancellationPolicy(): boolean {
		return true;
	}
	public isValid(): boolean {
		return this.timeOfArrival.isValid();
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Can cancel until %hour% on day of arrival", { hour: this.timeOfArrival.toString() });
	}

	public generateGuaranteedTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO {
		var ccUtils = new CancellationPolicyUtils();
		return ccUtils.generateStateChangeTriggerTimeDO(BookingStateChangeTriggerType.ExactTimestamp, triggerParams.arrivalDate, this.timeOfArrival);
	}
	public generateNoShowTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO {
		var ccUtils = new CancellationPolicyUtils();
		return ccUtils.generateMidnightStateChangeTriggerTimeDO(triggerParams.arrivalDate);
	}
}