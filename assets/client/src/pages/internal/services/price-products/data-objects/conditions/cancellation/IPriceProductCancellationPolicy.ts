import {BaseDO} from '../../../../../../../common/base/BaseDO';

export enum PriceProductCancellationPolicyType {
	NoPolicy,
	NoCancellationPossible,
	CanCancelDaysBefore,
	CanCancelBeforeTimeOnDayOfArrival
}
export interface CancellationPolicyDescription {
	phrase: string;
	parameters?: Object;
}

export interface IPriceProductCancellationPolicy extends BaseDO {
	getDescription(): CancellationPolicyDescription;
	hasCancellationPolicy(): boolean;
	isValid(): boolean;
}