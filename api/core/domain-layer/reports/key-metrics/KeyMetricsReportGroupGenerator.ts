import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThError } from '../../../utils/th-responses/ThError';
import { AReportGeneratorStrategy } from '../common/report-generator/AReportGeneratorStrategy';
import { IReportSectionGeneratorStrategy } from '../common/report-section-generator/IReportSectionGeneratorStrategy';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { NumberInListValidationRule } from '../../../utils/th-validation/rules/NumberInListValidationRule';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ReportGroupMeta } from '../common/result/ReportGroup';
import { KeyMetricsReportSectionGenerator } from './strategies/KeyMetricsReportSectionGenerator';
import { YieldManagerPeriodDO } from '../../../domain-layer/yield-manager/utils/YieldManagerPeriodDO';
import { KeyMetricReader } from '../../../domain-layer/yield-manager/key-metrics/KeyMetricReader';
import { KeyMetricsResult, KeyMetricsResultItem } from '../../../domain-layer/yield-manager/key-metrics/utils/KeyMetricsResult';
import { ThPeriodType } from './period-converter/ThPeriodDO';
import { ThDateToThPeriodConverterFactory } from './period-converter/ThDateToThPeriodConverterFactory';
import { PageOrientation } from '../../../services/pdf-reports/PageOrientation';
import { CommonValidationStructures } from "../../common/CommonValidations";

export class KeyMetricsReportGroupGenerator extends AReportGeneratorStrategy {
	private _period: YieldManagerPeriodDO;
	private _periodType: ThPeriodType;
	private _keyMetricItem: KeyMetricsResultItem;

	protected getParamsValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "startDate",
				validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
			},
			{
				key: "endDate",
				validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
			},
			{
				key: "periodType",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([ThPeriodType.Day, ThPeriodType.Month, ThPeriodType.Week]))
			}
		]);
	}

	protected loadParameters(params: any) {
		var startDate = new ThDateDO();
		startDate.buildFromObject(params.startDate);
		var endDate = new ThDateDO();
		endDate.buildFromObject(params.endDate);
		let dateInterval = ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
		this._period = new YieldManagerPeriodDO();
		this._period.referenceDate = dateInterval.start;
		this._period.noDays = dateInterval.getNumberOfDays() + 1;
		this._periodType = params.periodType;
	}

	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		let reader = new KeyMetricReader(this._appContext, this._sessionContext);
		reader.getKeyMetrics(this._period, false).then((reportItems: KeyMetricsResult) => {
			this._keyMetricItem = reportItems.currentItem;
			resolve(true);
		}).catch((e) => { reject(e); })
	}

	protected getMeta(): ReportGroupMeta {
		return {
			name: "Key Metrics",
			pageOrientation: PageOrientation.Landscape
		}
	}
	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		let converterFactory = new ThDateToThPeriodConverterFactory();
		let periodConverter = converterFactory.getConverter(this._periodType);
		return [
			new KeyMetricsReportSectionGenerator(this._appContext, this._sessionContext, this._keyMetricItem, periodConverter, this._periodType)
		];
	}
}