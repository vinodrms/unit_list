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

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.checkInFrom = new ThHourDO();
		this.checkInFrom.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "checkInFrom"));

		this.checkInToOptional = new ThHourDO();
		this.checkInToOptional.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "checkInToOptional"));

		this.checkOutFromOptional = new ThHourDO();
		this.checkOutFromOptional.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "checkOutFromOptional"));

		this.checkOutTo = new ThHourDO();
		this.checkOutTo.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "checkOutTo"));
	}
}