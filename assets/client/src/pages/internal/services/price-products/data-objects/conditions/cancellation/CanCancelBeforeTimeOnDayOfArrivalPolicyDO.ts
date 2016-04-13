import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {IPriceProductCancellationPolicy, CancellationPolicyDescription} from './IPriceProductCancellationPolicy';
import {ThHourDO} from '../../../../common/data-objects/th-dates/ThHourDO';

export class CanCancelBeforeTimeOnDayOfArrivalPolicyDO extends BaseDO implements IPriceProductCancellationPolicy {
	timeOfArrival: ThHourDO;
	
	constructor() {
		super();
		this.timeOfArrival = new ThHourDO();
		this.timeOfArrival.hour = 12;
		this.timeOfArrival.minute = 30;
	}

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.timeOfArrival = new ThHourDO();
		this.timeOfArrival.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "timeOfArrival"));
	}
	public getDescription(): CancellationPolicyDescription {
		return {
			phrase: "Can cancel before %timeOfArrival% on day of arrival",
			parameters: {
				timeOfArrival: this.timeOfArrival.hour + ":" + this.timeOfArrival.minute
			}
		}
	}

	public hasCancellationPolicy(): boolean {
		return true;
	}
	public isValid(): boolean {
		return this.timeOfArrival.isValid();
	}
}