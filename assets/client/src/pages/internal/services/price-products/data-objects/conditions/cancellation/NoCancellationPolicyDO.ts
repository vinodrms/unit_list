import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy, CancellationPolicyDescription} from './IPriceProductCancellationPolicy';

export class NoCancellationPolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public getDescription(): CancellationPolicyDescription {
		return {
			phrase: "Can cancel any time"
		}
	}
	public hasCancellationPolicy(): boolean {
		return false;
	}
	public isValid(): boolean {
		return true;
	}
}