import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy, CancellationPolicyDescription} from './IPriceProductCancellationPolicy';

export class CanCancelDaysBeforePolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	daysBefore: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["daysBefore"];
	}
	public getDescription(): CancellationPolicyDescription {
		return {
			phrase: "Can cancel until %daysBefore% days prior to arrival",
			parameters: {
				timeOfArrival: this.daysBefore
			}
		}
	}
	public hasCancellationPolicy(): boolean {
		return true;
	}
	public isValid(): boolean {
		if (_.isNumber(this.daysBefore) && this.daysBefore >= 0) {
			return true;
		}
		return false;
	}
}