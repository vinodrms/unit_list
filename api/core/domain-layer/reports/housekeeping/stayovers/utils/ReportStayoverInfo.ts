import { ThDateDO } from "../../../../../utils/th-dates/data-objects/ThDateDO";

export interface ReportStayoverInfo {
	floorNumber: number;
	roomNumber: string;
	customerName: string;
	companyOrTA: string;
	noAdults: number;
	noChildren: number;
	noBabies: number;
	noBabiesSleepingInBabyBeds: number;
	stationaryBeds: number;
	rollawayBeds: number;
	departingDate: ThDateDO;
	notes: string;
}