import { AppContext } from '../../utils/AppContext';
import { ThUtils } from '../../utils/ThUtils';
import { ReportDO } from '../../data-layer/reports/data-objects/ReportDO';
import { ReportType } from '../../data-layer/reports/data-objects/ReportMetadataDO';

import { IReportGeneratorStrategy } from './CommonInterfaces';
import { GuestsArrivingReportGeneratorStrategy } from './backup-report/strategies/GuestsArrivingReportGeneratorStrategy';
import { GuestsDepartingReportGeneratorStrategy } from './backup-report/strategies/GuestsDepartingReportGeneratorStrategy';
import { GuestsInHouseReportGeneratorStrategy } from './backup-report/strategies/GuestsInHouseReportGeneratorStrategy';

export class ReportGeneratorFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext,private _sessionContext) {
		this._thUtils = new ThUtils();
	}

	public getGeneratorStrategy(reportType: ReportType): IReportGeneratorStrategy {
		switch (reportType) {
			case ReportType.GuestsArriving:
				return new GuestsArrivingReportGeneratorStrategy(this._appContext, this._sessionContext);
			case ReportType.GuestsDeparting:
				return new GuestsDepartingReportGeneratorStrategy(this._appContext, this._sessionContext);
			case ReportType.GuestsInHouse:
				return new GuestsInHouseReportGeneratorStrategy(this._appContext, this._sessionContext);
			default:
				throw Error("Report not supported");
		}
	}
}