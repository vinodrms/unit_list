import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader } from '../../common/result/ReportSection';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { YieldManagerPeriodDO } from '../../../../domain-layer/yield-manager/utils/YieldManagerPeriodDO';
import { KeyMetricReader } from '../../../../domain-layer/yield-manager/key-metrics/KeyMetricReader';
import { KeyMetricsResult, KeyMetric, KeyMetricValueType, IKeyMetricValue, PriceKeyMetric, PercentageKeyMetric, InventoryKeyMetric } from '../../../../domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';

export class DailyKeyMetricsReportSectionGenerator extends AReportSectionGeneratorStrategy {
	private _period: YieldManagerPeriodDO;

	constructor(appContext: AppContext, private _sessionContext: SessionContext, private _dateInterval: ThDateIntervalDO) {
		super(appContext);
		this._period = new YieldManagerPeriodDO();
		this._period.referenceDate = this._dateInterval.start;
		this._period.noDays = this._dateInterval.getNumberOfDays();
	}

	protected getHeader(): ReportSectionHeader {
		var headerValues = ["Dates"];
		let dateList = this._dateInterval.getThDateDOList();
		dateList = dateList.slice(0, this._period.noDays);
		let dateStringList = _.map(dateList, (date: ThDateDO) => { return date.toString() });
		headerValues = headerValues.concat(dateStringList);
		return {
			display: true,
			values: headerValues
		};
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		let reader = new KeyMetricReader(this._appContext, this._sessionContext);

		var data: any[] = [];
		reader.getKeyMetrics(this._period).then((reportItems: KeyMetricsResult) => {
			let kmrItem = reportItems.currentItem;
			kmrItem.metricList.forEach((metric: KeyMetric) => {
				var typeStr = this._appContext.thTranslate.translate(metric.displayName);
				let row: any = [typeStr];
				_.forEach(metric.valueList, (value: IKeyMetricValue) => {
					row.push(value.getDisplayValue());
				})
				row.concat(metric.valueList);
				data.push(row);
			});
			resolve(data);
		}).catch((e) => { reject(e); })
	}
}