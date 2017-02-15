import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ReportInHouseReader } from '../in-house/ReportInHouseReader';
import { ReportInHouseItemInfo } from '../in-house/utils/ReportInHouseInfo';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';

export class GuestsInHouseReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {

	constructor(appContext: AppContext, private _sessionContext: SessionContext) {
		super(appContext);
	}

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [
				"Customer name",
				"Room number",
				"Adults",
				"Children",
				"Babies",
				"Baby Beds",
				"Departing Date",
				"Notes"
			]
		};
	}

	protected getMeta(): ReportSectionMeta {
		return {
			title: "Guests In House"
		}
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		let inhouseReader = new ReportInHouseReader(this._appContext, this._sessionContext);
		inhouseReader.read().then((reportItems: ReportInHouseItemInfo[]) => {
			var data = [];
			reportItems.forEach((item: ReportInHouseItemInfo) => {
				let row = [
					item.customerName,
					item.roomNumber,
					item.noAdults,
					item.noChildren,
					item.noBabies,
					item.noBabyBeds,
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
