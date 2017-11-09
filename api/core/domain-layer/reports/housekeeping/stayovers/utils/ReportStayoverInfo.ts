import { ThDateDO } from "../../../../../utils/th-dates/data-objects/ThDateDO";

export interface ReportStayoverInfo {
	floorNumber: number;
	roomNumber: string;
	customerName: string;
	interval: string;
	noNights: number;
	noAdults: number;
	noChildren: number;
	noBabies: number;
	noBabiesSleepingInBabyBeds: number;
	stationaryBeds: number;
	rollawayBeds: number;
	notes: string;
}