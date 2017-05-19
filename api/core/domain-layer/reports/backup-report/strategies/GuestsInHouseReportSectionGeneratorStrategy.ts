import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ReportInHouseReader } from '../in-house/ReportInHouseReader';
import { ReportInHouseItemInfo } from '../in-house/utils/ReportInHouseInfo';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';

export class GuestsInHouseReportSectionGeneratorStrategy extends AReportSectionGeneratorStrategy {

	private _totalGuests: number = 0;
	private _totalAdults: number = 0;
	private _totalChildren: number = 0;
	private _totalBabies: number = 0;
	private _totalBabyBeds: number = 0;

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [
				"Customer name",
				"Room number",
				"Arrival/Departure",
				"Number of Nights",
				"Adults",
				"Children",
				"Babies",
				"Baby Beds",
				"Notes"
			]
		};
	}

	protected getMeta(): ReportSectionMeta {
		return {
			title: "Guests In House"
		}
	}

	protected getGlobalSummary(): Object {
		return {
			"Total Number of Guests in House" : this._totalGuests,
			"Guests Adults": this._totalAdults,
			"Guests Children": this._totalChildren,
			"Guests Babies": this._totalBabies,
			"Guests Baby Beds": this._totalBabyBeds
		}
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		let inhouseReader = new ReportInHouseReader(this._appContext, this._sessionContext);
		inhouseReader.read().then((reportItems: ReportInHouseItemInfo[]) => {
			this._totalGuests = reportItems.length;
			var data = [];
			reportItems.forEach((item: ReportInHouseItemInfo) => {
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
					item.roomNumber,
					item.interval,
					item.noNights,
					item.noAdults,
					item.noChildren,
					item.noBabies,
					item.noBabyBeds,
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
