import {BaseDO} from '../../../../common/base/BaseDO';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {BookingStateChangeTriggerTimeDO} from '../../../../bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';

export enum PriceProductCancellationPolicyType {
	NoPolicy,
	NoCancellationPossible,
	CanCancelDaysBefore,
	CanCancelBeforeTimeOnDayOfArrival
}

export interface PolicyTriggerTimeParams {
	arrivalDate: ThDateDO;
}

export interface IPriceProductCancellationPolicy extends BaseDO {
	hasCancellationPolicy(): boolean;
	isValid(): boolean;
	getValueDisplayString(thTranslation: ThTranslation): string;

	generateGuaranteedTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO;
	generateNoShowTriggerTime(triggerParams: PolicyTriggerTimeParams): BookingStateChangeTriggerTimeDO;
}