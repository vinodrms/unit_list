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
				policyName: "Can cancel whenever",
				policyType: PriceProductCancellationPolicyType.NoPolicy
			},
			{
				policyName: "No cancellation possible",
				policyType: PriceProductCancellationPolicyType.NoCancellationPossible
			},
			{
				policyName: "Can cancel before number of days until arrival",
				policyType: PriceProductCancellationPolicyType.CanCancelDaysBefore
			},
			{
				policyName: "Can cancel before time on day of arrival",
				policyType: PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival
			}
		];
	}
}