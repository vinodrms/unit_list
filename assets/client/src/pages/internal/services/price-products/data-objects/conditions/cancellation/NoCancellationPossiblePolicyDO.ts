import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy, CancellationPolicyDescription} from './IPriceProductCancellationPolicy';

export class NoCancellationPossiblePolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public getDescription(): CancellationPolicyDescription {
		return {
			phrase: "No cancellation"
		}
	}
	public hasCancellationPolicy(): boolean {
		return true;
	}
	public isValid(): boolean {
		return true;
	}
}