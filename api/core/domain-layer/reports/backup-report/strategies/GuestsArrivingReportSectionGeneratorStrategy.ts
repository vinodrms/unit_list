import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ReportArrivalsReader } from '../arrivals/ReportArrivalsReader';
import { ReportArrivalItemInfo } from '../arrivals/utils/ReportArrivalsInfo';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';

export class GuestsArrivingReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {

	private _totalArrivals: number = 0;
	private _totalAdults: number = 0;
	private _totalChildren: number = 0;
	private _totalBabies: number = 0;
	private _totalBabyBeds: number = 0;

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [
				"Customer name",
				"Agency",
				"Room category",
				"Room number",
				"Arrival/Departure",
				"Number of Nights",
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

	protected getGlobalSummary(): Object {
		return {
			"Total Number of Arrivals" : this._totalArrivals,
			"Adults": this._totalAdults,
			"Children": this._totalChildren,
			"Babies": this._totalBabies,
			"Baby Beds": this._totalBabyBeds
		}
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		let arrivalsReader = new ReportArrivalsReader(this._appContext, this._sessionContext);
		arrivalsReader.read().then((reportItems: ReportArrivalItemInfo[]) => {
			this._totalArrivals = reportItems.length;
			var data = [];
			reportItems.forEach((item: ReportArrivalItemInfo) => {
				if (item.noAdults != null) {
					this._totalAdults += item.noAdults;
				}
				if (item.noChildren != null) {
					this._totalChildren += item.noChildren;
				}
				if (item.noBabies != null) {
					this._totalBabies += item.noBabies;
				}
				if (item.noBabyBeds != null) {
					this._totalBabyBeds += item.noBabyBeds;
				}
				let row = [
					item.customerName,
					item.corporateCustomerName,
					item.roomCategory,
					item.roomNumber,
					item.interval,
					item.noNights,
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