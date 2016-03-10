import {BaseDO} from '../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy} from './IPriceProductCancellationPolicy';

export class NoCancellationPolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	
	public hasCancellationPolicy(): boolean {
		return false;
	}
	public isValid(): boolean {
		return true;
	}
}