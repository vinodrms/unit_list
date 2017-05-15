import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ReportArrivalsReader } from "../arrivals/ReportArrivalsReader";
import { ReportArrivalItemInfo } from "../arrivals/utils/ReportArrivalsInfo";

export class ArrivalsReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {
    
	private _totalArrivals: number;
	
	protected getHeader(): ReportSectionHeader {
        return {
			display: true,
			values: [
				"Floor",
                "Room",
				"Room category",
                "Customer",
				"Company/TA",
				"Arrival/Departure",
				"Number of Nights",
				"Adults",
				"Children",
				"Babies",
				"Babies (in baby beds)",
				"Stationary Beds",
				"Rollaway Beds",
				"Notes"
			]
		};
    }
    protected getMeta(): ReportSectionMeta {
        return {
			title: "Arrivals"
		}
    }

	protected getSummary(): Object {
		return {
			"Total Number of Arrivals" : this._totalArrivals
		}
	}

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
		let arrivalsReader = new ReportArrivalsReader(this._appContext, this._sessionContext);
        arrivalsReader.read().then((reportItems: ReportArrivalItemInfo[]) => {
			this._totalArrivals = reportItems.length;
			var data = [];
			reportItems.forEach((item: ReportArrivalItemInfo) => {
				let row = [
					item.floorNumber,
					item.roomNumber,
					item.roomCategory,
					item.customerName,
					item.companyOrTA,
					item.interval,
					item.noNights,
					item.noAdults,
					item.noChildren,
					item.noBabies,
					item.noBabiesSleepingInBabyBeds,
					item.stationaryBeds,
					item.rollawayBeds,
					item.notes
				];
				data.push(row);
			});
			resolve(data);
		}).catch((e) => {
			reject(e);
		});
    }
    
}