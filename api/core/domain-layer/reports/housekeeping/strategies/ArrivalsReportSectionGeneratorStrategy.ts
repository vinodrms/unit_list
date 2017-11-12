import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ReportArrivalsReader } from "../arrivals/ReportArrivalsReader";
import { ReportArrivalItemInfo } from "../arrivals/utils/ReportArrivalsInfo";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";

export class ArrivalsReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {
    
	private _totalArrivals: number;
	private _floor: number;
	private _totalArrivalsOnFloor: number = 0;

	constructor(appContext: AppContext, sessionContext: SessionContext, globalSummary: Object, floor?: number) {
		super(appContext, sessionContext, globalSummary);
		this._floor = floor;
	}

    protected getHeader(): ReportSectionHeader {
        return {
			display: true,
			values: [
				"Floor",
                "Room",
				"Room category",
                "Customer",
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
			title: (!this._floor) ? "Arrivals" : this._appContext.thTranslate.translate("Arrivals Floor %floorNumber%", {floorNumber: this._floor})
		}
    }

	protected getGlobalSummary(): Object {	
		return {
			"Total Number of Arrivals" : this._totalArrivals
		}
	}

	protected getLocalSummary(): Object {
		if (this._floor) {
			return {
				"Total Arrivals": this._totalArrivalsOnFloor
			}
		} else {
			return {};
		}
	}

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
		let arrivalsReader = new ReportArrivalsReader(this._appContext, this._sessionContext);
        arrivalsReader.read().then((reportItems: ReportArrivalItemInfo[]) => {
			this._totalArrivals = reportItems.length;
			var data = [];
			reportItems.forEach((item: ReportArrivalItemInfo) => {
				if (!this._floor || (item.floorNumber && this._floor == item.floorNumber)) {
					this._totalArrivalsOnFloor++;
					let row = [
						item.floorNumber,
						item.roomNumber,
						item.roomCategory,
						item.customerName,
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
				}
			});
			resolve(data);
		}).catch((e) => {
			reject(e);
		});
    }
    
}