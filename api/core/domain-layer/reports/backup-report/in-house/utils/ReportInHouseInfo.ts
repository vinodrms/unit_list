import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';

export interface ReportInHouseItemInfo {
	customerName: string;
	roomNumber: string;
	noAdults: number,
	noChildren: number,
	noBabies: number;
	noBabyBeds: number;
	departingDate: ThDateDO;
	notes: string;
}