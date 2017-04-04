import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";
import { ReportArrivalsReader } from "../arrivals/ReportArrivalsReader";
import { ReportArrivalItemInfo } from "../arrivals/utils/ReportArrivalsInfo";

export class ArrivalsReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {
    protected getHeader(): ReportSectionHeader {
        return {
			display: true,
			values: [
                "Floor number",
                "Room number",
				"Room category",
                "Customer name",
				"Adults",
				"Children",
				"Babies",
				"Rollaway Baby Beds",
                "Other Rollaway Beds",
				"Notes"
			]
		};
    }
    protected getMeta(): ReportSectionMeta {
        return {
			title: "Arrivals"
		}
    }
    protected getDataCore(resolve: (result: any[][]) => void, reject: (err: ThError) => void) {
		let arrivalsReader = new ReportArrivalsReader(this._appContext, this._sessionContext);
        arrivalsReader.read().then((reportItems: ReportArrivalItemInfo[]) => {
			var data = [];
			reportItems.forEach((item: ReportArrivalItemInfo) => {
				let row = [
					item.floorNumber,
					item.roomNumber,
					item.roomCategory,
					item.customerName,
					item.noAdults,
					item.noChildren,
					item.noBabies,
					item.noBabyRollawayBeds,
					item.noOtherRollawayBeds,
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