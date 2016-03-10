import {BaseDO} from '../../../../common/base/BaseDO';

export enum PriceProductCancellationPenaltyType {
	NoPenalty,
	FullStay,
	FirstNightOnly,
	PercentageFromBooking
}

export interface PriceProductCancellationPenaltyQueryDO {
	noOfNights: number;
	totalPrice: number;
}

export interface IPriceProductCancellationPenalty extends BaseDO {
	hasCancellationPenalty(): boolean;
	getPenaltyPriceFor(query: PriceProductCancellationPenaltyQueryDO): number;
	isValid(): boolean;
}