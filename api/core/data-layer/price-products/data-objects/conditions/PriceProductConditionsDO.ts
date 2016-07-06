import {BaseDO} from '../../../common/base/BaseDO';

import {IPriceProductCancellationPolicy, PriceProductCancellationPolicyType} from './cancellation/IPriceProductCancellationPolicy';
import {NoCancellationPolicyDO} from './cancellation/NoCancellationPolicyDO';
import {NoCancellationPossiblePolicyDO} from './cancellation/NoCancellationPossiblePolicyDO';
import {CanCancelDaysBeforePolicyDO} from './cancellation/CanCancelDaysBeforePolicyDO';
import {CanCancelBeforeTimeOnDayOfArrivalPolicyDO} from './cancellation/CanCancelBeforeTimeOnDayOfArrivalPolicyDO';

import {IPriceProductCancellationPenalty, PriceProductCancellationPenaltyType} from './penalty/IPriceProductCancellationPenalty';
import {NoCancellationPenaltyDO} from './penalty/NoCancellationPenaltyDO';
import {FullStayCancellationPenaltyDO} from './penalty/FullStayCancellationPenaltyDO';
import {FirstNightOnlyCancellationPenaltyDO} from './penalty/FirstNightOnlyCancellationPenaltyDO';
import {PercentageFromBookingCancellationPenaltyDO} from './penalty/PercentageFromBookingCancellationPenaltyDO';

import {ThTranslation, Locales} from '../../../../utils/localization/ThTranslation';

export class PriceProductConditionsDO extends BaseDO {
	policyType: PriceProductCancellationPolicyType;
	policy: IPriceProductCancellationPolicy;

	penaltyType: PriceProductCancellationPenaltyType;
	penalty: IPriceProductCancellationPenalty;

	protected getPrimitivePropertyKeys(): string[] {
		return ["policyType", "penaltyType"];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		switch (this.policyType) {
			case PriceProductCancellationPolicyType.NoPolicy:
				this.policy = new NoCancellationPolicyDO();
				break;
			case PriceProductCancellationPolicyType.NoCancellationPossible:
				this.policy = new NoCancellationPossiblePolicyDO();
				break;
			case PriceProductCancellationPolicyType.CanCancelDaysBefore:
				this.policy = new CanCancelDaysBeforePolicyDO();
				break;
			case PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival:
				this.policy = new CanCancelBeforeTimeOnDayOfArrivalPolicyDO();
				break;
		}
		this.policy.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "policy"));

		switch (this.penaltyType) {
			case PriceProductCancellationPenaltyType.NoPenalty:
				this.penalty = new NoCancellationPenaltyDO();
				break;
			case PriceProductCancellationPenaltyType.FullStay:
				this.penalty = new FullStayCancellationPenaltyDO();
				break;
			case PriceProductCancellationPenaltyType.FirstNightOnly:
				this.penalty = new FirstNightOnlyCancellationPenaltyDO();
				break;
			case PriceProductCancellationPenaltyType.PercentageFromBooking:
				this.penalty = new PercentageFromBookingCancellationPenaltyDO();
				break;
		}
		this.penalty.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "penalty"));
	}

	public isValid(): boolean {
		if (!this.policy.hasCancellationPolicy()) {
			if (!this.penalty.hasCancellationPenalty()) {
				return true;
			}
			return false;
		}
		if (!this.penalty.hasCancellationPenalty()) {
			return false;
		}
		return this.policy.isValid() && this.penalty.isValid();
	}

	public getValueDisplayString(thTranslation: ThTranslation): string {
		return this.policy.getValueDisplayString(thTranslation) + '/' + this.penalty.getValueDisplayString(thTranslation);
	}
}