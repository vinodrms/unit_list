import {BaseDO} from '../../../common/base/BaseDO';

export class OperationHoursDO extends BaseDO {
	constructor() {
		super();
	}
	checkInFrom: number;
	checkInTo: number;

	checkOutFrom: number;
	checkOutTo: number;

	protected getPrimitivePropertyKeys(): string[] {
		return ["checkInFrom", "checkInTo", "checkOutFrom", "checkOutTo"];
	}
}