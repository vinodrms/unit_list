import {BaseDO} from '../../common/base/BaseDO';
import {ThUtils} from '../../../utils/ThUtils';

export enum ReportType {
	GuestsArriving,
	GuestsInHouse,
	GuestsDeparting
}

export enum FieldType{
	Number,
	String,
	Date,
	DateTime,
	Select
}

export class ReportMetadataDO extends BaseDO{
	type: ReportType;
	name: string;
	inputParams: [{
		type: FieldType,
		name: string,
		required: boolean
	}];
	columns: [{
		type: FieldType,
		name: string
	}]

	protected getPrimitivePropertyKeys(): string[] {
		return ["type", "name", "inpuParams", "columns"];
	}
}