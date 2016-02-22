import {BaseDO} from '../../../common/base/BaseDO';
import {HourDO} from './HourDO';

export class OperationHoursDO extends BaseDO {
	constructor() {
		super();
	}
	checkInFrom: HourDO;
	checkInToOptional: HourDO;

	checkOutFromOptional: HourDO;
	checkOutTo: HourDO;

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}

	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.checkInFrom = new HourDO();
		this.checkInFrom.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "checkInFrom"));

		this.checkInToOptional = new HourDO();
		this.checkInToOptional.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "checkInToOptional"));

		this.checkOutFromOptional = new HourDO();
		this.checkOutFromOptional.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "checkOutFromOptional"));

		this.checkOutTo = new HourDO();
		this.checkOutTo.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "checkOutTo"));
	}
}