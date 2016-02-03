import {BaseDO} from '../../../common/base/BaseDO';

export class OperationHoursDO extends BaseDO {
	constructor() {
		super();
	}
	checkInFrom: number;
	checkInTo: number;

	checkOutFrom: number;
	checkOutTo: number;

	protected getPrimitiveProperties(): string[] {
		return ["checkInFrom", "checkInTo", "checkOutFrom", "checkOutTo"];
	}
}