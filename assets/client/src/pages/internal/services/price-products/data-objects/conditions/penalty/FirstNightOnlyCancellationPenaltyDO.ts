import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPenalty, CancellationPenaltyDescription} from './IPriceProductCancellationPenalty';

export class FirstNightOnlyCancellationPenaltyDO extends BaseDO implements IPriceProductCancellationPenalty {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public getDescription(): CancellationPenaltyDescription {
		return {
			phrase: "Pay first night"
		}
	}
	public hasCancellationPenalty(): boolean {
		return true;
	}

	public isValid(): boolean {
		return true;
	}
}