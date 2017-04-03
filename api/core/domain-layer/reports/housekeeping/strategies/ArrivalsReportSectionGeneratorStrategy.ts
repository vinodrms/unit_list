import { AReportSectionGeneratorStrategy } from "../../common/report-section-generator/AReportSectionGeneratorStrategy";
import { ReportSectionHeader, ReportSectionMeta } from "../../common/result/ReportSection";
import { ThError } from "../../../../utils/th-responses/ThError";

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
        let data: any[][] = [[]];

        resolve(data);
    }
    
}