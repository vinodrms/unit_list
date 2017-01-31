import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ReportDepartureReader } from '../departures/ReportDepartureReader';
import { ReportDepartureInfo } from '../departures/utils/ReportDepartureInfo';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader } from '../../common/result/ReportSection';

export class GuestsDepartingReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {

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
				"Total Price",
				"Notes"
			]
		};
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		let departureReader = new ReportDepartureReader(this._appContext, this._sessionContext);
		departureReader.read().then((reportItems: ReportDepartureInfo[]) => {
			var data = [];
			reportItems.forEach((item: ReportDepartureInfo) => {
				let row = [
					item.customerName,
					item.roomNumber,
					item.noAdults,
					item.noChildren,
					item.noBabies,
					item.totalPrice,
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