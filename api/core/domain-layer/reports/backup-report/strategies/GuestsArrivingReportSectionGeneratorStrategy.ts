import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ReportArrivalsReader } from '../arrivals/ReportArrivalsReader';
import { ReportArrivalItemInfo } from '../arrivals/utils/ReportArrivalsInfo';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';

export class GuestsArrivingReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [
				"Customer name",
				"Room category",
				"Room number",
				"Adults",
				"Children",
				"Babies",
				"Baby Beds",
				"Booking status",
				"Total price",
				"No show time",
				"Notes"
			]
		};
	}

	protected getMeta(): ReportSectionMeta {
		return {
			title: "Guests Arriving"
		}
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		let arrivalsReader = new ReportArrivalsReader(this._appContext, this._sessionContext);
		arrivalsReader.read().then((reportItems: ReportArrivalItemInfo[]) => {
			var data = [];
			reportItems.forEach((item: ReportArrivalItemInfo) => {
				let row = [
					item.customerName,
					item.roomCategory,
					item.roomNumber,
					item.noAdults,
					item.noChildren,
					item.noBabies,
					item.noBabyBeds,
					item.bookingStatus,
					item.totalPrice,
					item.cancelationHours,
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