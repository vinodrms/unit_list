import {IPriceProductCancellationPenalty, PriceProductCancellationPenaltyType, CancellationPenaltyMeta} from './IPriceProductCancellationPenalty';
import {NoCancellationPenaltyDO} from './NoCancellationPenaltyDO';
import {FullStayCancellationPenaltyDO} from './FullStayCancellationPenaltyDO';
import {FirstNightOnlyCancellationPenaltyDO} from './FirstNightOnlyCancellationPenaltyDO';
import {PercentageFromBookingCancellationPenaltyDO} from './PercentageFromBookingCancellationPenaltyDO';
import {PriceProductCancellationPolicyType} from '../cancellation/IPriceProductCancellationPolicy';

export class PriceProductCancellationPenaltyFactory {
	public getCancellationPenaltyByPenaltyType(penaltyType: PriceProductCancellationPenaltyType): IPriceProductCancellationPenalty {
		switch (penaltyType) {
			case PriceProductCancellationPenaltyType.FullStay:
				return new FullStayCancellationPenaltyDO();
			case PriceProductCancellationPenaltyType.FirstNightOnly:
				return new FirstNightOnlyCancellationPenaltyDO();
			case PriceProductCancellationPenaltyType.PercentageFromBooking:
				return new PercentageFromBookingCancellationPenaltyDO();
			default:
				return new NoCancellationPenaltyDO();
		}
	}
	public getCancellationPenaltyMetaList(): CancellationPenaltyMeta[] {
		return [
			{
				penaltyName: "No cancellation penalty",
				penaltyType: PriceProductCancellationPenaltyType.NoPenalty,
				usedWithPolicyTypeList: [PriceProductCancellationPolicyType.NoPolicy]
			},
			{
				penaltyName: "Pay full stay",
				penaltyType: PriceProductCancellationPenaltyType.FullStay,
				usedWithPolicyTypeList: [PriceProductCancellationPolicyType.CanCancelDaysBefore, PriceProductCancellationPolicyType.NoCancellationPossible, , PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival]
			},
			{
				penaltyName: "Pay first night",
				penaltyType: PriceProductCancellationPenaltyType.FirstNightOnly,
				usedWithPolicyTypeList: [PriceProductCancellationPolicyType.CanCancelDaysBefore, PriceProductCancellationPolicyType.NoCancellationPossible, , PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival]
			},
			{
				penaltyName: "Pay percentage from booking",
				penaltyType: PriceProductCancellationPenaltyType.PercentageFromBooking,
				usedWithPolicyTypeList: [PriceProductCancellationPolicyType.CanCancelDaysBefore, PriceProductCancellationPolicyType.NoCancellationPossible, , PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival]
			}
		];
	}
	
	public getDefaultPenaltyWithoutConditions(): {penalty: IPriceProductCancellationPenalty, penaltyType: PriceProductCancellationPenaltyType} {
		return {
			penalty: new NoCancellationPenaltyDO(),
			penaltyType: PriceProductCancellationPenaltyType.NoPenalty
		};
	}
	public getDefaultPenaltyWithConditions(): {penalty: IPriceProductCancellationPenalty, penaltyType: PriceProductCancellationPenaltyType} {
		return {
			penalty: new FullStayCancellationPenaltyDO(),
			penaltyType: PriceProductCancellationPenaltyType.FullStay
		};
	}
}