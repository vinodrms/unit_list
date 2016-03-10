import {BaseDO} from '../../../../common/base/BaseDO';

export enum PriceProductCancellationPolicyType {
	NoPolicy,
	NoCancellationPossible,
	CanCancelDaysBefore,
	CanCancelBeforeTimeOnDayOfArrival
}

export interface IPriceProductCancellationPolicy extends BaseDO {
	hasCancellationPolicy(): boolean;
	isValid(): boolean;
}