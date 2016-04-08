import {BaseDO} from '../../../../../../../common/base/BaseDO';

export enum PriceProductCancellationPenaltyType {
	NoPenalty,
	FullStay,
	FirstNightOnly,
	PercentageFromBooking
}

export interface IPriceProductCancellationPenalty extends BaseDO {
	hasCancellationPenalty(): boolean;
	isValid(): boolean;
}