import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ReportInHouseReader } from '../in-house/ReportInHouseReader';
import { ReportInHouseItemInfo } from '../in-house/utils/ReportInHouseInfo';
import { AReportItemGenerator } from '../../common/report-item-generator/AReportItemGenerator';
import { ReportItemHeader } from '../../common/result/ReportItem';

export class GuestsInHouseReportItemGeneratorStrategy extends AReportItemGenerator {

	constructor(appContext: AppContext, private _sessionContext: SessionContext) {
		super(appContext);
	}

	protected getHeader(): ReportItemHeader {
		return {
			displayHeader: true,
			values: [
				"Customer name",
				"Room number",
				"Adults",
				"Children",
				"Babies",
				"Departing Date",
				"Notes"
			]
		};
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
