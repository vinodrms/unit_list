import { AppContext } from '../../../../utils/AppContext';
import { ThUtils } from '../../../../utils/ThUtils';
import { ReportGroupType } from '../../ReportGeneratorDO';
import { IReportGeneratorStrategy } from './IReportGeneratorStrategy';
import { KeyMetricsReportGroupGenerator } from '../../key-metrics/KeyMetricsReportGroupGenerator';
import { BackUpReportGroupGenerator } from '../../backup-report/BackUpReportGroupGenerator';
import { ShiftReportGroupGenerator } from '../../shift-report/ShiftReportGroupGenerator';
import { HousekeepingReportGroupGenerator } from "../../housekeeping/HousekeepingReportGroupGenerator";
import { BookingsReportGroupGenerator } from "../../bookings/BookingsReportGroupGenerator";
import { InvoicesReportGroupGenerator } from "../../invoices-report/InvoicesReportGroupGenerator";
import { GuestsReportGroupGenerator } from "../../guests/GuestsReportGroupGenerator";

export class ReportGeneratorFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext) {
		this._thUtils = new ThUtils();
	}

	public getGeneratorStrategy(reportType: ReportGroupType): IReportGeneratorStrategy {
		switch (reportType) {
			case ReportGroupType.KeyMetrics:
				return new KeyMetricsReportGroupGenerator(this._appContext, this._sessionContext);
			case ReportGroupType.Backup:
				return new BackUpReportGroupGenerator(this._appContext, this._sessionContext);
			case ReportGroupType.Shift:
				return new ShiftReportGroupGenerator(this._appContext, this._sessionContext);
			case ReportGroupType.Housekeeping:
				return new HousekeepingReportGroupGenerator(this._appContext, this._sessionContext);
			case ReportGroupType.Bookings:
				return new BookingsReportGroupGenerator(this._appContext, this._sessionContext);
			case ReportGroupType.Invoices:
				return new InvoicesReportGroupGenerator(this._appContext, this._sessionContext);
			case ReportGroupType.Guests:
				return new GuestsReportGroupGenerator(this._appContext, this._sessionContext);
		}
	}
}