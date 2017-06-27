import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { AReportGeneratorStrategy } from '../common/report-generator/AReportGeneratorStrategy';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { IReportSectionGeneratorStrategy } from '../common/report-section-generator/IReportSectionGeneratorStrategy';
import { ReportGroupMeta } from '../common/result/ReportGroup';
import { PageOrientation } from '../../../services/pdf-reports/PageOrientation';
import { CommonValidationStructures } from "../../common/CommonValidations";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { ThError } from "../../../utils/th-responses/ThError";
import { HotelDO } from "../../../data-layer/hotel/data-objects/HotelDO";
import { HotelDetailsBuilder, HotelDetailsDO } from "../../hotel-details/utils/HotelDetailsBuilder";
import { ReportSectionHeader } from "../common/result/ReportSection";
import { LazyLoadRepoDO } from "../../../data-layer/common/repo-data-objects/LazyLoadRepoDO";
import { ThDateIntervalDO } from "../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { BookingSearchCriteriaRepoDO, BookingSearchResultRepoDO } from "../../../data-layer/bookings/repositories/IBookingRepository";
import { BookingDOConstraints } from "../../../data-layer/bookings/data-objects/BookingDOConstraints";
import { BookingDO, BookingConfirmationStatus } from "../../../data-layer/bookings/data-objects/BookingDO";
import { ThDateToThPeriodConverterFactory } from "../key-metrics/period-converter/ThDateToThPeriodConverterFactory";
import { ThPeriodType, ThPeriodDO } from "../key-metrics/period-converter/ThPeriodDO";
import { CustomerSearchResultRepoDO } from "../../../data-layer/customers/repositories/ICustomerRepository";
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { RoomDO } from "../../../data-layer/rooms/data-objects/RoomDO";
import { RoomSearchResultRepoDO } from "../../../data-layer/rooms/repositories/IRoomRepository";
import { RoomCategoryStatsAggregator } from "../../room-categories/aggregators/RoomCategoryStatsAggregator";
import { RoomCategoryStatsDO } from "../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { CountryDO } from "../../../data-layer/common/data-objects/country/CountryDO";
import { CountryContainer } from "./utils/CountryContainer";
import { TaxResponseRepoDO } from "../../../data-layer/taxes/repositories/ITaxRepository";
import { TaxDO } from "../../../data-layer/taxes/data-objects/TaxDO";
import { KeyMetricReader } from "../../yield-manager/key-metrics/KeyMetricReader";
import { KeyMetricsReaderInputBuilder } from "../../yield-manager/key-metrics/utils/KeyMetricsReaderInputBuilder";
import { YieldManagerPeriodDO } from "../../yield-manager/utils/YieldManagerPeriodDO";
import { CommissionOption } from "../../yield-manager/key-metrics/utils/KeyMetricsReaderInput";
import { KeyMetricOutputType } from "../../yield-manager/key-metrics/utils/builder/MetricBuilderStrategyFactory";
import { KeyMetricsResult, KeyMetricsResultItem, KeyMetric } from "../../yield-manager/key-metrics/utils/KeyMetricsResult";
import { KeyMetricType } from "../../yield-manager/key-metrics/utils/KeyMetricType";
import { GuestNightsDividedByBookingSegmentSectionGenerator } from "./sections/GuestNightsDividedByBookingSegmentSectionGenerator";
import { GuestNightsSectionGenerator } from "./sections/GuestNightsSectionGenerator";
import { GuestNightsDividedByNationalitySectionGenerator } from "./sections/GuestNightsDividedByNationalitySectionGenerator";
import { HotelGetDetails } from "../../hotel-details/get-details/HotelGetDetails";
import { ArrivalsSectionGenerator } from "./sections/ArrivalsSectionGenerator";
import { ArrivalsFromHomeCountrySectionGenerator } from "./sections/ArrivalsFromHomeCountrySectionGenerator";
import { RoomNightsSectionGenerator } from "./sections/RoomNightsSectionGenerator";
import { RoomNightsDividedByBookingSegmentSectionGenerator } from "./sections/RoomNightsDividedByBookingSegmentSectionGenerator";
import { TotalAvgRateSectionGenerator } from "./sections/TotalAvgRateSectionGenerator";
import { BreakfastSectionGenerator } from "./sections/BreakfastSectionGenerator";
import { HotelInventorySnapshotSearchResultRepoDO } from "../../../data-layer/hotel-inventory-snapshots/repositories/IHotelInventorySnapshotRepository";

export class MonthlyStatsReportGroupGenerator extends AReportGeneratorStrategy {
	private _startDate: ThDateDO;
	private _endDate: ThDateDO;
	private _period: YieldManagerPeriodDO;
	private _excludeVat: boolean;

	private _hotelDetails: HotelDetailsDO;
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

		]);
	}

	protected loadParameters(params: any) {
		this._startDate = new ThDateDO();
		this._startDate.buildFromObject(params.startDate);
		this._endDate = new ThDateDO();
		this._endDate.buildFromObject(params.endDate);

		this._excludeVat = true;
	}

	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		let dateInterval = ThDateIntervalDO.buildThDateIntervalDO(this._startDate, this._endDate);
		this._period = new YieldManagerPeriodDO();
		this._period.referenceDate = dateInterval.start;
		this._period.noDays = dateInterval.getNumberOfDays() + 1;

		let snapshotRepo = this._appContext.getRepositoryFactory().getSnapshotRepository();
		snapshotRepo.getSnapshotList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
			thDateUtcTimestamp: dateInterval.end.getUtcTimestamp()
		}).then((result: HotelInventorySnapshotSearchResultRepoDO) => {
			let snapshotList = result.snapshotList;
			if(_.isEmpty(snapshotList))
		})

		let hotelGetDetails = new HotelGetDetails(this._appContext, this._sessionContext);
		hotelGetDetails.getDetails().then((hotelDetails: HotelDetailsDO) => {
			this._hotelDetails = hotelDetails;

			let reader = new KeyMetricReader(this._appContext, this._sessionContext);
			return reader.getKeyMetrics(
				new KeyMetricsReaderInputBuilder()
					.setYieldManagerPeriodDO(this._period)
					.includePreviousPeriod(false)
					.setDataAggregationType(ThPeriodType.Month)
					.setCommissionOption(CommissionOption.EXCLUDE)
					.excludeVat(this._excludeVat)
					.build(),
				KeyMetricOutputType.MonthlyStatsReport
			);
		}).then((reportItems: KeyMetricsResult) => {
			this._keyMetricItem = reportItems.currentItem;
			resolve(true);
		}).catch((e) => { reject(e); })
	}

	protected getMeta(): ReportGroupMeta {
		var startDateKey: string = this._appContext.thTranslate.translate("Start Date");
		var endDateKey: string = this._appContext.thTranslate.translate("End Date");
		var excludeVat: string = this._appContext.thTranslate.translate("Exclude VAT");

		var displayParams = {};
		displayParams[startDateKey] = this._startDate;
		displayParams[endDateKey] = this._endDate;
		displayParams[excludeVat] = 
			this._excludeVat? this._appContext.thTranslate.translate("Yes") : this._appContext.thTranslate.translate("No");

		return {
			name: "Monthly Stats Report",
			pageOrientation: PageOrientation.Portrait,
			displayParams: displayParams
		}
	}

	protected getGlobalSummary(): Object {
		return {};
	}

	protected getLocalSummary(): Object {
		return {};
	}

	protected getHeader(): ReportSectionHeader {
		return {
			display: true,
			values: [

			]
		};
	}

	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		let homeCountry = this._hotelDetails.hotel.contactDetails.address.country;
		return [
			new GuestNightsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				ThPeriodType.Month, this._keyMetricItem),
			new GuestNightsDividedByBookingSegmentSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				ThPeriodType.Month, this._keyMetricItem),
			new GuestNightsDividedByNationalitySectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				ThPeriodType.Month, this._keyMetricItem, homeCountry),
			new ArrivalsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				ThPeriodType.Month, this._keyMetricItem),
			new ArrivalsFromHomeCountrySectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				ThPeriodType.Month, this._keyMetricItem, homeCountry),
			new RoomNightsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				ThPeriodType.Month, this._keyMetricItem),
			new RoomNightsDividedByBookingSegmentSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				ThPeriodType.Month, this._keyMetricItem),
			new TotalAvgRateSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				ThPeriodType.Month, this._keyMetricItem),
			new BreakfastSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				ThPeriodType.Month, this._keyMetricItem)
		];
	}
}