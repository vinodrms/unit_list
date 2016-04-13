import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {PriceProductCancellationPolicyType} from '../cancellation/IPriceProductCancellationPolicy';

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

export interface CancellationPenaltyMeta {
	penaltyName: string;
	penaltyType: PriceProductCancellationPenaltyType;
	usedWithPolicyTypeList: PriceProductCancellationPolicyType[];
}