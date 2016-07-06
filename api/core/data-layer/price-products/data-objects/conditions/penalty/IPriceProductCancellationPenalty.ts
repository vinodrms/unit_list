import {BaseDO} from '../../../../common/base/BaseDO';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';

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
	getValueDisplayString(thTranslation: ThTranslation): string;
}