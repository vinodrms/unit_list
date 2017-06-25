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
import { KeyMetricsReaderInputBuilder } from "../../yield-manager/key-metrics/utils/KeyMetricsReaderInputBuilder";
import { CommissionOption, CommissionOptionDisplayNames } from "../../yield-manager/key-metrics/utils/KeyMetricsReaderInput";
import { ArrayValidationStructure } from "../../../utils/th-validation/structure/ArrayValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";
import { KeyMetricOutputType } from "../../yield-manager/key-metrics/utils/builder/MetricBuilderStrategyFactory";

export class KeyMetricsReportGroupGenerator extends AReportGeneratorStrategy {
	private _period: YieldManagerPeriodDO;
	private _periodType: ThPeriodType;
	private _startDate: ThDateDO;
	private _endDate: ThDateDO;
	private _commissionOption: CommissionOption;
	private _excludeVat: boolean;
	private _keyMetricItem: KeyMetricsResultItem;
	private _customerIdList: string[];

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
			},
		],
		[
			{
                key: "customerIdList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
            },
		]);
	}

	protected loadParameters(params: any) {
		this._startDate = new ThDateDO();
		this._startDate.buildFromObject(params.startDate);
		this._endDate = new ThDateDO();
		this._endDate.buildFromObject(params.endDate);
		let dateInterval = ThDateIntervalDO.buildThDateIntervalDO(this._startDate, this._endDate);
		this._period = new YieldManagerPeriodDO();
		this._period.referenceDate = dateInterval.start;
		this._period.noDays = dateInterval.getNumberOfDays() + 1;
		this._periodType = params.periodType;
		this._commissionOption = params.commissionOption;
		this._excludeVat = params.excludeVat;
		this._customerIdList = params.customerIdList;
	}

	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		let reader = new KeyMetricReader(this._appContext, this._sessionContext);
		reader.getKeyMetrics(
			new KeyMetricsReaderInputBuilder()
				.setYieldManagerPeriodDO(this._period)
				.includePreviousPeriod(false)
				.setDataAggregationType(this._periodType)
				.excludeVat(this._excludeVat)
				.setCommissionOption(this._commissionOption)
				.setCustomerIdList(this._customerIdList)
				.build(),
			KeyMetricOutputType.KeyMetricReport
		).then((reportItems: KeyMetricsResult) => {
			this._keyMetricItem = reportItems.currentItem;
			resolve(true);
		}).catch((e) => { reject(e); })
	}

	protected getMeta(): ReportGroupMeta {
		var startDateKey: string = this._appContext.thTranslate.translate("Start Date");
		var endDateKey: string = this._appContext.thTranslate.translate("End Date");
		var groupValuesByKey: string = this._appContext.thTranslate.translate("Group Values By");
		var commission: string = this._appContext.thTranslate.translate("Deducted Commission");
		var excludeVat: string = this._appContext.thTranslate.translate("Exclude VAT");
		
		var displayParams = {};
		displayParams[startDateKey] = this._startDate;
		displayParams[endDateKey] = this._endDate;
		displayParams[groupValuesByKey] = this.getDisplayStringFromPeriodType();
		displayParams[commission] = this._appContext.thTranslate.translate(CommissionOptionDisplayNames[this._commissionOption]);
		displayParams[excludeVat] = 
			this._excludeVat? this._appContext.thTranslate.translate("Yes") : this._appContext.thTranslate.translate("No");
		
		return {
			name: "Key Metrics",
			displayParams: displayParams,
			pageOrientation: PageOrientation.Landscape
		}
	}

	private getDisplayStringFromPeriodType() {
		switch (this._periodType) {
			case ThPeriodType.Day: return this._appContext.thTranslate.translate("Day");
			case ThPeriodType.Week: return this._appContext.thTranslate.translate("Week");
			case ThPeriodType.Month: return this._appContext.thTranslate.translate("Month");
			default: return "";
		}
	}
	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		let converterFactory = new ThDateToThPeriodConverterFactory();
		let periodConverter = converterFactory.getConverter(this._periodType);
		return [
			new KeyMetricsReportSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._keyMetricItem, periodConverter, this._periodType)
		];
	}
}