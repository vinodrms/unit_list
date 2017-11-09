import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ReportStayoversReader } from "../stayovers/ReportStayoversReader";
import { ReportStayoverInfo } from "../stayovers/utils/ReportStayoverInfo";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";

export class StayoversReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {
    
	private _totalStayovers: number;
	private _floor: number;
	private _totalStayoversOnFloor: number = 0;

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
			title: (!this._floor) ? "Stayovers" : this._appContext.thTranslate.translate("Stayovers Floor %floorNumber%", {floorNumber: this._floor})
		}
    }

	protected getGlobalSummary(): Object {
		return {
			"Total Number of Stayovers" : this._totalStayovers
		}
	}

	protected getLocalSummary(): Object {
		if (this._floor) {
			return {
				"Total Stayovers": this._totalStayoversOnFloor
			}
		} else {
			return {};
		}
	}

    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let arrivalsReader = new ReportStayoversReader(this._appContext, this._sessionContext);
        arrivalsReader.read().then((reportItems: ReportStayoverInfo[]) => {
			this._totalStayovers = reportItems.length;
			var data = [];
			reportItems.forEach((item: ReportStayoverInfo) => {
				if (!this._floor || (item.floorNumber && this._floor == item.floorNumber)) {
				this._totalStayoversOnFloor++;
				let row = [
					item.floorNumber,
					item.roomNumber,
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