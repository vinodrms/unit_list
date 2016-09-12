import {IPriceProductCancellationPolicy, PriceProductCancellationPolicyType, CancellationPolicyMeta} from './IPriceProductCancellationPolicy';
import {NoCancellationPolicyDO} from './NoCancellationPolicyDO';
import {NoCancellationPossiblePolicyDO} from './NoCancellationPossiblePolicyDO';
import {CanCancelDaysBeforePolicyDO} from './CanCancelDaysBeforePolicyDO';
import {CanCancelBeforeTimeOnDayOfArrivalPolicyDO} from './CanCancelBeforeTimeOnDayOfArrivalPolicyDO';

export class PriceProductCancellationPolicyFactory {
	public getCancellationPolicyByPolicyType(policyType: PriceProductCancellationPolicyType): IPriceProductCancellationPolicy {
		switch (policyType) {
			case PriceProductCancellationPolicyType.NoCancellationPossible:
				return new NoCancellationPossiblePolicyDO();
			case PriceProductCancellationPolicyType.CanCancelDaysBefore:
				return new CanCancelDaysBeforePolicyDO();
			case PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival:
				return new CanCancelBeforeTimeOnDayOfArrivalPolicyDO();
			default:
				return new NoCancellationPolicyDO();
		}
	}
	public getCancellationPolicyMetaList(): CancellationPolicyMeta[] {
		return [
			{
				policyName: "Can cancel any time",
				policyType: PriceProductCancellationPolicyType.NoPolicy
			},
			{
				policyName: "No cancellation",
				policyType: PriceProductCancellationPolicyType.NoCancellationPossible
			},
			{
				policyName: "Can cancel until X days before arrival",
				policyType: PriceProductCancellationPolicyType.CanCancelDaysBefore
			},
			{
				policyName: "Can cancel until X time on day upon arrival",
				policyType: PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival
			}
		];
	}
}