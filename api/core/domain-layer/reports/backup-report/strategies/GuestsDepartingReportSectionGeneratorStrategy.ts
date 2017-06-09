import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ReportDepartureReader } from '../departures/ReportDepartureReader';
import { ReportDepartureInfo } from '../departures/utils/ReportDepartureInfo';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';
import { ThDateDO } from "../../../../utils/th-dates/data-objects/ThDateDO";

export class GuestsDepartingReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {

	private _totalDepartures: number = 0;
	private _totalAdults: number = 0;
	private _totalChildren: number = 0;
	private _totalBabies: number = 0;
	private _totalBabyBeds: number = 0;

    constructor(_appContext: AppContext, _sessionContext: SessionContext, _globalSummary: Object, private _date: ThDateDO) {
		super(_appContext, _sessionContext, _globalSummary);
	}

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [
				"Customer name",
				"Agency",
				"Room number",
				"Arrival/Departure",
				"Number of Nights",
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

	protected getGlobalSummary(): Object {
		return {
			"Total Number of Departures" : this._totalDepartures,
			"Departures Adults": this._totalAdults,
			"Departures Children": this._totalChildren,
			"Departures Babies": this._totalBabies,
			"Departures Baby Beds": this._totalBabyBeds
		}
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		let departureReader = new ReportDepartureReader(this._appContext, this._sessionContext, this._date);
		departureReader.read().then((reportItems: ReportDepartureInfo[]) => {
			this._totalDepartures = reportItems.length;
			var data = [];
			reportItems.forEach((item: ReportDepartureInfo) => {
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
					item.roomNumber,
					item.interval,
					item.noNights,
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