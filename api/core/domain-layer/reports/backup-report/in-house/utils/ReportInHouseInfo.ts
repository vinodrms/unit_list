import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';

export interface ReportInHouseItemInfo {
	customerName: string;
	roomNumber: string;
	interval: string;
	noNights: number;
	noAdults: number,
	noChildren: number,
	noBabies: number;
	noBabyBeds: number;
	notes: string;
}