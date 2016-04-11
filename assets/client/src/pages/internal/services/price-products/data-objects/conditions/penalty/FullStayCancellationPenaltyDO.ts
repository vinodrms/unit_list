import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty} from './IPriceProductCancellationPenalty';

export class FullStayCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public hasCancellationPenalty(): boolean {
		return true;
	}

	public isValid(): boolean {
		return true;
	}
}