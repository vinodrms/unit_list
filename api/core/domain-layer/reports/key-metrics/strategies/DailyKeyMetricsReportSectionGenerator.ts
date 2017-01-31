import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader } from '../../common/result/ReportSection';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { YieldManagerPeriodDO } from '../../../../domain-layer/yield-manager/utils/YieldManagerPeriodDO';
import { KeyMetricReader } from '../../../../domain-layer/yield-manager/key-metrics/KeyMetricReader';
import { KeyMetricsResult, KeyMetric, KeyMetricValueType, IKeyMetricValue, PriceKeyMetric, PercentageKeyMetric, InventoryKeyMetric } from '../../../../domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';

export class DailyKeyMetricsReportSectionGenerator extends AReportSectionGeneratorStrategy {

	constructor(appContext: AppContext, private _sessionContext: SessionContext, private _dateInterval: ThDateIntervalDO) {
		super(appContext);
	}

	protected getHeader(): ReportSectionHeader {
		return {
			display: false
		};
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		let period = this.getPeriodFromParams();
		let reader = new KeyMetricReader(this._appContext, this._sessionContext);

		var data: any[] = [];
		reader.getKeyMetrics(period).then((reportItems: KeyMetricsResult) => {
			let kmrItem = reportItems.currentItem;
			kmrItem.metricList.forEach((metric: KeyMetric) => {
				var typeStr = this._appContext.thTranslate.translate(metric.displayName);
				let row: any = [typeStr];
				_.forEach(metric.valueList, (value: IKeyMetricValue) => {
					var m = this.metricToString(metric.valueType, value);
					row.push(m);
				})
				row.concat(metric.valueList);
				data.push(row);
			});
			resolve(data);
		})
	}

	private getPeriodFromParams(): YieldManagerPeriodDO {
		var period = new YieldManagerPeriodDO();
		period.referenceDate = this._dateInterval.start;
		period.noDays = this._dateInterval.getNumberOfDays();
		return period;
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
}