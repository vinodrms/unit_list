import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThUtils } from '../../../../utils/ThUtils';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader } from '../../common/result/ReportSection';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { KeyMetricsResultItem, KeyMetric, KeyMetricValueType, IKeyMetricValue, PriceKeyMetric, PercentageKeyMetric, InventoryKeyMetric } from '../../../../domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';
import { ThPeriodDO, ThPeriodType } from '../period-converter/ThPeriodDO';
import { IThDateToThPeriodConverter } from '../period-converter/IThDateToThPeriodConverter';

interface IKeyMetricValueGroup {
	period: ThPeriodDO;
	metricValue?: IKeyMetricValue;
	count: number;
}

export class KeyMetricsReportSectionGenerator extends AReportSectionGeneratorStrategy {
	private _thUtils: ThUtils;

	// use to keep the chronological order of the results 
	private _periodIdList: string[];
	// used to aggregate the values of a single metric by periods
	private _periodIdToValueGroupMap: { [index: string]: IKeyMetricValueGroup; };
	// used for caching ThPeriod objects
	private _thDateToThPeriodMap: { [index: string]: ThPeriodDO; };

	constructor(appContext: AppContext, private _sessionContext: SessionContext,
		private _kmResultItem: KeyMetricsResultItem, private _periodConverter: IThDateToThPeriodConverter) {
		super(appContext);

		this._thUtils = new ThUtils();
		this._periodIdList = [];
		this._periodIdToValueGroupMap = {};
		this._thDateToThPeriodMap = {};
	}

	protected getHeader(): ReportSectionHeader {
		var headerValues = [this._appContext.thTranslate.translate("Dates")];
		this._kmResultItem.dateList.forEach((thDate: ThDateDO) => {
			let period = this._periodConverter.convert(thDate);
			if (this._thUtils.isUndefinedOrNull(this._periodIdToValueGroupMap[period.id])) {
				this._periodIdList.push(period.id);
				this._periodIdToValueGroupMap[period.id] = {
					period: period,
					count: 0
				};
				headerValues.push(period.displayString);
			}
			this._thDateToThPeriodMap[thDate.toString()] = period;
		});
		return {
			display: true,
			values: headerValues
		};
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		var data: any[] = [];
		this._kmResultItem.metricList.forEach((metric: KeyMetric) => {
			for (var i = 0; i < metric.valueList.length; i++) {
				let metricValue = metric.valueList[i];
				let thDate = this._kmResultItem.dateList[i];
				let thPeriod = this._thDateToThPeriodMap[thDate.toString()];

				let group = this._periodIdToValueGroupMap[thPeriod.id];
				if (group.count == 0) {
					group.count = 1;
					group.metricValue = metricValue;
				} else {
					group.metricValue.add(metricValue);
					group.count++;
				}
			}
			Object.keys(this._periodIdToValueGroupMap).forEach((id: string) => {
				let group = this._periodIdToValueGroupMap[id];
				group.metricValue.divideBy(group.count);
			});

			var typeStr = this._appContext.thTranslate.translate(metric.displayName);
			let row: any = [typeStr];
			this._periodIdList.forEach((periodId: string) => {
				let group = this._periodIdToValueGroupMap[periodId];
				row.push(group.metricValue.getDisplayValue());
				group.metricValue = null;
				group.count = 0;
			});
			data.push(row);
		});
		resolve(data);
	}
}