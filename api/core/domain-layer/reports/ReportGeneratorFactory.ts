import { AppContext } from '../../utils/AppContext';
import { ThUtils } from '../../utils/ThUtils';
import { ReportDO } from '../../data-layer/reports/data-objects/ReportDO';
import { ReportType } from '../../data-layer/reports/data-objects/ReportMetadataDO';

import { IReportGeneratorStrategy } from './IReportGeneratorStrategy';
import { GuestsArrivingReportGeneratorStrategy } from './strategies/GuestsArrivingReportGeneratorStrategy';
import { GuestsDepartingReportGeneratorStrategy } from './strategies/GuestsDepartingReportGeneratorStrategy';
import { GuestsInHouseReportGeneratorStrategy } from './strategies/GuestsInHouseReportGeneratorStrategy';

export class ReportGeneratorFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext) {
		this._thUtils = new ThUtils();
	}

	public getGeneratorStrategy(reportType: ReportType): IReportGeneratorStrategy {
		switch (reportType) {
			case ReportType.GuestsArriving:
				return new GuestsArrivingReportGeneratorStrategy(this._appContext);
			case ReportType.GuestsDeparting:
				return new GuestsDepartingReportGeneratorStrategy(this._appContext);
			case ReportType.GuestsInHouse:
				return new GuestsInHouseReportGeneratorStrategy(this._appContext);
			default:
				throw Error("Report not supported");
		}
	}
}