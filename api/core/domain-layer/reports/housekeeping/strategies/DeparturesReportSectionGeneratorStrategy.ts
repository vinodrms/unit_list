import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ReportDeparturesReader } from "../departures/ReportDeparturesReader";
import { ReportDepartureItemInfo } from "../departures/utils/ReportDepartureItemInfo";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";

export class DeparturesReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {
    
	private _totalDepartures: number;
	private _floor: number;
	private _totalDeparturesOnFloor: number = 0;

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
			title: (!this._floor) ? "Departures" : this._appContext.thTranslate.translate("Departures Floor %floorNumber%", {floorNumber: this._floor}),
			pageBreakAfter: (!this._floor)? false : true
		}
    }

	protected getGlobalSummary(): Object {
		return {
			"Total Number of Departures" : this._totalDepartures
		}
	}

	protected getLocalSummary(): Object {
		if (this._floor) {
			return {
				"Total Departures": this._totalDeparturesOnFloor
			}
		} else {
			return {};
		}
	}

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let depaturesReader = new ReportDeparturesReader(this._appContext, this._sessionContext);
        depaturesReader.read().then((reportItems: ReportDepartureItemInfo[]) => {
			this._totalDepartures = reportItems.length;
			var data = [];
			reportItems.forEach((item: ReportDepartureItemInfo) => {
				if (!this._floor || (item.floorNumber && this._floor == item.floorNumber)) {
					this._totalDeparturesOnFloor++;
					let row = [
						item.floorNumber,
						item.roomNumber,
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
				}
			});
			resolve(data);
		}).catch((e) => {
			reject(e);
		});
    }


}