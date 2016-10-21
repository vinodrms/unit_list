import { ReportDO } from '../../../../data-layer/reports/data-objects/ReportDO';
import { ReportMetadataDO, FieldType } from '../../../../data-layer/reports/data-objects/ReportMetadataDO';
import { HotelOperationsArrivalsInfo } from '../../../../domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';
import { ReportType } from '../../../../data-layer/reports/data-objects/ReportMetadataDO';
import { AReportGeneratorStrategy } from '../../AReportGeneratorStrategy';
import { ThError } from '../../../../utils/th-responses/ThError';
import { HotelOperationsArrivalsReader } from '../../../../domain-layer/hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader';

import { KeyMetricReader } from '../../../../domain-layer/yield-manager/key-metrics/KeyMetricReader';
import { YieldManagerPeriodDO } from '../../../../domain-layer/yield-manager/utils/YieldManagerPeriodDO';
import { KeyMetricsResult, KeyMetricsResultItem, KeyMetric, KeyMetricValueType, IKeyMetricValue, PriceKeyMetric, PercentageKeyMetric, InventoryKeyMetric } from '../../../../domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';
import { KeyMetricType } from '../../../../domain-layer/yield-manager/key-metrics/utils/KeyMetricType';

import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';

export class KeyMetricsReportDailyStrategy extends AReportGeneratorStrategy {
	protected _reportType: ReportType = ReportType.GuestsArriving;

	protected validParameters(params: Object) {
		return true;
	}

	protected buildReportData(reportMetadata): Promise<ReportDO> {
		return new Promise<ReportDO>((resolve: { (result: ReportDO): void }, reject: { (err: ThError): void }) => {
			var report = new ReportDO();
			report.metadata = reportMetadata ? reportMetadata : new ReportMetadataDO();
			report.data = [];

			// new HotelGetDetails(req.appContext, req.sessionContext)
			let period = this.getPeriodFromParams();
			let arrivalsReader = new KeyMetricReader(this._appContext, this._sessionContext);

			arrivalsReader.getKeyMetrics(period).then((reportItems: KeyMetricsResult) => {
				let kmrItem = reportItems.currentItem;
				this.buildMetadata(report, kmrItem);
				kmrItem.metricList.forEach((metric: KeyMetric) => {
					// TODO: Bug with thTranslate #72
					var typeStr = this._appContext.thTranslate.translate(this.getMetricTypeString(metric.type));
					let row: any = [typeStr];
					_.forEach(metric.valueList, (value: IKeyMetricValue) => {
						var m = this.metricToString(metric.valueType, value);
						row.push(m);
					})
					row.concat(metric.valueList);
					report.data.push(row);
				});
				resolve(report);
			})
		});
	}

	private getPeriodFromParams():YieldManagerPeriodDO{
		//TODO: period should be returned from this._params
		var period = new YieldManagerPeriodDO();
		period.referenceDate = ThDateDO.buildThDateDO(2016, 9, 20);
		period.noDays = 100;
		return period;
	}

	private getMetricTypeString(type: KeyMetricType) {
		switch(type){
			case KeyMetricType.TotalOccupancy:
				return "TotalOccupancy";
			case KeyMetricType.ConfirmedOccupancy:
				return "ConfirmedOccupancy";
			case KeyMetricType.TotalRevPar:
				return "TotalRevPar";
			case KeyMetricType.ConfirmedRevPar:
				return "ConfirmedRevPar";
			case KeyMetricType.TotalAvgRate:
				return "TotalAvgRate";
			case KeyMetricType.ConfirmedAvgRate:
				return "ConfirmedAvgRate";
			case KeyMetricType.Rooms:
				return "Rooms";
			case KeyMetricType.Allotments:
				return "Allotments";
			case KeyMetricType.RoomRevenue:
				return "RoomRevenue";
			case KeyMetricType.OtherRevenue:
				return "OtherRevenue";
			default:
				return type;
		}
	}

	private metricToString(valueType: KeyMetricValueType, value: IKeyMetricValue): string {
		switch (valueType) {
			case KeyMetricValueType.Inventory:
				let available = (<InventoryKeyMetric>value).available.toString();
				let total = (<InventoryKeyMetric>value).total.toString();
				return '"' + available + " of " + total + '"';
			case KeyMetricValueType.Percentage:
				return '"' + (<PercentageKeyMetric>value).percentage.toString() + '"';
			case KeyMetricValueType.Price:
				return '"' + (<PriceKeyMetric>value).price.toString() + '"';
		}
	}

	private buildMetadata(report: ReportDO, metricResultItem: KeyMetricsResultItem) {
		report.metadata.columns = [{ type: FieldType.Date, name: "" }];
		metricResultItem.dateList.forEach((date) => {
			report.metadata.columns.push({
				type: FieldType.Date,
				name: date.toString()
			})
		})
	}
}
