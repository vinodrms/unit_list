import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy} from './IPriceProductCancellationPolicy';
import {ThHourDO} from '../../../../common/data-objects/th-dates/ThHourDO';

export class CanCancelBeforeTimeOnDayOfArrivalPolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	timeOfArrival: ThHourDO;

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.timeOfArrival = new ThHourDO();
		this.timeOfArrival.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "timeOfArrival"));
	}

	public hasCancellationPolicy(): boolean {
		return true;
	}
	public isValid(): boolean {
		return this.timeOfArrival.isValid();
	}
}