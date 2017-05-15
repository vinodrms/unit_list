import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThUtils } from '../../../../utils/ThUtils';
import { AReportSectionGeneratorStrategy } from '../../common/report-section-generator/AReportSectionGeneratorStrategy';
import { ReportSectionHeader, ReportSectionMeta } from '../../common/result/ReportSection';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { KeyMetricsResultItem, KeyMetric, IKeyMetricValueGroup } from '../../../yield-manager/key-metrics/utils/KeyMetricsResult';
import { IKeyMetricValue, KeyMetricValueType } from '../../../yield-manager/key-metrics/utils/values/IKeyMetricValue';
import { ThPeriodDO, ThPeriodType } from '../period-converter/ThPeriodDO';
import { IThDateToThPeriodConverter } from '../period-converter/IThDateToThPeriodConverter';

export class KeyMetricsReportSectionGenerator extends AReportSectionGeneratorStrategy {
	// use to keep the chronological order of the results 
	private _periodIdList: string[];
	// used to aggregate the values of a single metric by periods
	private _periodIdToValueGroupMap: { [index: string]: IKeyMetricValueGroup; };
	// used for caching ThPeriod objects
	private _thDateToThPeriodMap: { [index: string]: ThPeriodDO; };

	constructor(appContext: AppContext, sessionContext: SessionContext,
		private _kmResultItem: KeyMetricsResultItem, private _periodConverter: IThDateToThPeriodConverter,
		private _periodType: ThPeriodType) {
		super(appContext, sessionContext);

		this._periodIdList = [];
		this._periodIdToValueGroupMap = {};
		this._thDateToThPeriodMap = {};
	}

	protected getHeader(): ReportSectionHeader {
		var headerValues = [this._appContext.thTranslate.translate("Metric")];
		this._kmResultItem.dateList.forEach((thDate: ThDateDO, index: number) => {
			let period = this._periodConverter.convert(thDate);
			if (this._thUtils.isUndefinedOrNull(this._periodIdToValueGroupMap[period.id])) {
				this._periodIdList.push(period.id);
				this._periodIdToValueGroupMap[period.id] = {
					period: period
				};
				this.tryUpdatePeriodMarginDisplayString(period, thDate, index);
				headerValues.push(period.displayString);
			}
			else {
				period = this._periodIdToValueGroupMap[period.id].period;
				let didUpdate = this.tryUpdatePeriodMarginDisplayString(period, thDate, index);
				if (didUpdate) {
					headerValues.pop();
					headerValues.push(period.displayString);
				}
			}
			this._thDateToThPeriodMap[thDate.toString()] = period;
		});
		return {
			display: true,
			values: headerValues
		};
	}
	private tryUpdatePeriodMarginDisplayString(period: ThPeriodDO, thDate: ThDateDO, index: number): boolean {
		if (index == 0 && period.dateStart.isBefore(thDate)) {
			period.dateStart = thDate;
			this.updatePeriodDisplayString(period);
			return true;
		}
		if (index == this._kmResultItem.dateList.length - 1 && thDate.isBefore(period.dateEnd)) {
			period.dateEnd = thDate;
			this.updatePeriodDisplayString(period);
			return true;
		}
		return false;
	}
	private updatePeriodDisplayString(period: ThPeriodDO) {
		period.displayString = period.dateStart.toString() + " - " + period.dateEnd.toString();
	}

	protected getMeta(): ReportSectionMeta {
		return {};
	}

	protected getSummary(): Object {
		return {};
	}

	protected getDataCore(resolve: { (result: any[][]): void }, reject: { (err: ThError): void }) {
		var data: any[] = [];
		this._kmResultItem.metricList.forEach((metric: KeyMetric) => {
			let typeStr = this._appContext.thTranslate.translate(metric.displayName);
			let row: any = [typeStr];
			for (var i = 0; i < metric.aggregatedValueList.length; i++) {				
				row.push(metric.aggregatedValueList[i].metricValue.getDisplayValue(this._periodType));
			}
			data.push(row);
			row = [];
		});
		resolve(data);
	}
}