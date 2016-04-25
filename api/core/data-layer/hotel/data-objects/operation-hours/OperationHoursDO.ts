import {BaseDO} from '../../../common/base/BaseDO';
import {ThHourDO} from '../../../../utils/th-dates/data-objects/ThHourDO';

export class OperationHoursDO extends BaseDO {
	constructor() {
		super();
	}
	checkInFrom: ThHourDO;
	checkInToOptional: ThHourDO;

	checkOutFromOptional: ThHourDO;
	checkOutTo: ThHourDO;

	cancellationHour: ThHourDO;

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.checkInFrom = this.buildThHourDO(object, "checkInFrom");
		this.checkInToOptional = this.buildThHourDO(object, "checkInToOptional");
		this.checkOutFromOptional = this.buildThHourDO(object, "checkOutFromOptional");
		this.checkOutTo = this.buildThHourDO(object, "checkOutTo");
		this.cancellationHour = this.buildThHourDO(object, "cancellationHour");
	}

	private buildThHourDO(object: Object, objectKey: string): ThHourDO {
		var hour = new ThHourDO();
		hour.buildFromObject(this.getObjectPropertyEnsureUndefined(object, objectKey));
		return hour;
	}
}