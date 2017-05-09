import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ReportDepartureReader } from '../departures/ReportDepartureReader';
import { ReportDepartureInfo } from '../departures/utils/ReportDepartureInfo';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';

export class GuestsDepartingReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [
				"Customer name",
				"Agency",
				"Room number",
				"Adults",
				"Children",
				"Babies",
				"Baby Beds",
				"Total Price",
				"Notes"
			]
		};
	}

	protected getMeta(): ReportSectionMeta {
		return {
			title: "Guests Departing"
		}
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		let departureReader = new ReportDepartureReader(this._appContext, this._sessionContext);
		departureReader.read().then((reportItems: ReportDepartureInfo[]) => {
			var data = [];
			reportItems.forEach((item: ReportDepartureInfo) => {
				let row = [
					item.customerName,
					item.corporateCustomerName,
					item.roomNumber,
					item.noAdults,
					item.noChildren,
					item.noBabies,
					item.noBabyBeds,
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