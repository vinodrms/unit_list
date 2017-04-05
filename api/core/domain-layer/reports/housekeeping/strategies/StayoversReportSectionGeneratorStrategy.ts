import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ReportStayoversReader } from "../stayovers/ReportStayoversReader";
import { ReportStayoverInfo } from "../stayovers/utils/ReportStayoverInfo";

export class StayoversReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {
    protected getHeader(): ReportSectionHeader {
        return {
			display: true,
			values: [
                "Floor",
                "Room",
                "Customer",
				"Adults",
				"Children",
				"Babies",
				"Babies (in baby beds)",
				"Stationary Beds",
				"Rollaway Beds",
				"Departure date",
				"Notes"
			]
		};
    }
    protected getMeta(): ReportSectionMeta {
        return {
			title: "Stayovers"
		}
    }
    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
        let arrivalsReader = new ReportStayoversReader(this._appContext, this._sessionContext);
        arrivalsReader.read().then((reportItems: ReportStayoverInfo[]) => {
			var data = [];
			reportItems.forEach((item: ReportStayoverInfo) => {
				let row = [
					item.floorNumber,
					item.roomNumber,
					item.customerName,
					item.noAdults,
					item.noChildren,
					item.noBabies,
					item.noBabiesSleepingInBabyBeds,
					item.stationaryBeds,
					item.rollawayBeds,
					item.departingDate,
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