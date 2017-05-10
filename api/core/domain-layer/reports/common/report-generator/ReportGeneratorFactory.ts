import { AppContext } from '../../../../utils/AppContext';
import { ThUtils } from '../../../../utils/ThUtils';
import { ReportGroupType } from '../../ReportGeneratorDO';
import { IReportGeneratorStrategy } from './IReportGeneratorStrategy';
import { KeyMetricsReportGroupGenerator } from '../../key-metrics/KeyMetricsReportGroupGenerator';
import { BackUpReportGroupGenerator } from '../../backup-report/BackUpReportGroupGenerator';
import { ShiftReportGroupGenerator } from '../../shift-report/ShiftReportGroupGenerator';
import { BookingsForPriceProductReportGroupGenerator } from "../../bookings-for-price-product/BookingsForPriceProductReportGroupGenerator";
import { HousekeepingReportGroupGenerator } from "../../housekeeping/HousekeepingReportGroupGenerator";
import { BookingsByIntervalReportGroupGenerator } from "../../bookings-by-interval/BookingsByIntervalReportGroupGenerator";

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
			case ReportGroupType.BookingsForPriceProduct:
				return new BookingsForPriceProductReportGroupGenerator(this._appContext, this._sessionContext);
			case ReportGroupType.Housekeeping:
				return new HousekeepingReportGroupGenerator(this._appContext, this._sessionContext);
			case ReportGroupType.BookingsByInterval:
				return new BookingsByIntervalReportGroupGenerator(this._appContext, this._sessionContext);
		}
	}
}