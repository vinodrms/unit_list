import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';
import {IPriceProductCancellationPolicy} from './IPriceProductCancellationPolicy';
import {NumberValidationRule} from '../../../../../utils/th-validation/rules/NumberValidationRule';
import {CancellationPolicyUtils} from './utils/CancellationPolicyUtils';
import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThHourDO} from '../../../../../utils/th-dates/data-objects/ThHourDO';
import {ThDateUtils} from '../../../../../utils/th-dates/ThDateUtils';
import {BookingCancellationTimeDO, BookingCancellationTimeType} from '../../../../bookings/data-objects/cancellation-time/BookingCancellationTimeDO';

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
	public generateBookingCancellationTimeDO(arrivalDate: ThDateDO, currentHotelDate: ThDateDO): BookingCancellationTimeDO {
		var thDateUtils = new ThDateUtils();
		var cancelDateDO = arrivalDate.buildPrototype();
		cancelDateDO = thDateUtils.addDaysToThDateDO(cancelDateDO, (-1 * this.daysBefore));

		var ccUtils = new CancellationPolicyUtils();
		return ccUtils.generateBookingCancellationTimeDO(BookingCancellationTimeType.DependentOnCancellationHour, cancelDateDO, ThHourDO.buildThHourDO(0, 0));
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Can cancel %daysBefore% days before arrival", { daysBefore: this.daysBefore });
	}
}