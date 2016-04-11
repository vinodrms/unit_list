import {BaseDO} from '../../../../../../../common/base/BaseDO';

export enum PriceProductCancellationPenaltyType {
	NoPenalty,
	FullStay,
	FirstNightOnly,
	PercentageFromBooking
}

export interface CancellationPenaltyDescription {
	phrase: string;
	parameters?: Object;
}

export interface IPriceProductCancellationPenalty extends BaseDO {
	getDescription(): CancellationPenaltyDescription;
	hasCancellationPenalty(): boolean;
	isValid(): boolean;
}