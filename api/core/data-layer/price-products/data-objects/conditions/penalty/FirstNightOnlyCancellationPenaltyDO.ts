import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty, PriceProductCancellationPenaltyQueryDO} from './IPriceProductCancellationPenalty';
import {ThTranslation} from '../../../../../utils/localization/ThTranslation';

export class FirstNightOnlyCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public hasCancellationPenalty(): boolean {
		return true;
	}
	public getPenaltyPriceFor(query: PriceProductCancellationPenaltyQueryDO): number {
		if (query.noOfNights <= 0) {
			return 0.0;
		}
		return query.totalPrice / query.noOfNights;
	}
	public isValid(): boolean {
		return true;
	}
	public getValueDisplayString(thTranslation: ThTranslation): string {
		return thTranslation.translate("Pay first night");
	}
}