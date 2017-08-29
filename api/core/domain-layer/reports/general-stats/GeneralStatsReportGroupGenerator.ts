

import { AReportGeneratorStrategy } from "../common/report-generator/AReportGeneratorStrategy";
import { ThDateDO } from "../../../utils/th-dates/data-objects/ThDateDO";
import { YieldManagerPeriodDO } from "../../yield-manager/utils/YieldManagerPeriodDO";
import { HotelDetailsDO } from "../../hotel-details/utils/HotelDetailsBuilder";
import { KeyMetricsResultItem, KeyMetricsResult, IKeyMetricValueGroup } from "../../yield-manager/key-metrics/utils/KeyMetricsResult";
import { RoomDO } from "../../../data-layer/rooms/data-objects/RoomDO";
import { RoomCategoryStatsDO } from "../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { CommonValidationStructures } from "../../common/CommonValidations";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { ThError } from "../../../utils/th-responses/ThError";
import { ThDateIntervalDO } from "../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { HotelGetDetails } from "../../hotel-details/get-details/HotelGetDetails";
import { RoomCategoryStatsAggregator } from "../../room-categories/aggregators/RoomCategoryStatsAggregator";
import { KeyMetricReader } from "../../yield-manager/key-metrics/KeyMetricReader";
import { KeyMetricsReaderInputBuilder } from "../../yield-manager/key-metrics/utils/KeyMetricsReaderInputBuilder";
import { ThPeriodType, ThPeriodDO } from "../key-metrics/period-converter/ThPeriodDO";
import { CommissionOption } from "../../yield-manager/key-metrics/utils/KeyMetricsReaderInput";
import { KeyMetricOutputType } from "../../yield-manager/key-metrics/utils/builder/MetricBuilderStrategyFactory";
import { RoomSearchResultRepoDO } from "../../../data-layer/rooms/repositories/IRoomRepository";
import { HotelInventorySnapshotSearchResultRepoDO } from "../../../data-layer/hotel-inventory-snapshots/repositories/IHotelInventorySnapshotRepository";
import { RoomSnapshotDO } from "../../../data-layer/hotel-inventory-snapshots/data-objects/room/RoomSnapshotDO";
import { ReportGroupMeta } from "../common/result/ReportGroup";
import { PageOrientation } from "../../../services/pdf-reports/PageOrientation";
import { ReportSectionHeader } from "../common/result/ReportSection";
import { IReportSectionGeneratorStrategy } from "../common/report-section-generator/IReportSectionGeneratorStrategy";
import { GuestNightsSectionGenerator } from "./sections/GuestNightsSectionGenerator";
import { GuestNightsDividedByBookingSegmentSectionGenerator } from "./sections/GuestNightsDividedByBookingSegmentSectionGenerator";
import { GuestNightsDividedByNationalitySectionGenerator } from "./sections/GuestNightsDividedByNationalitySectionGenerator";
import { ArrivalsSectionGenerator } from "./sections/ArrivalsSectionGenerator";
import { ArrivalsFromHomeCountrySectionGenerator } from "./sections/ArrivalsFromHomeCountrySectionGenerator";
import { RoomNightsSectionGenerator } from "./sections/RoomNightsSectionGenerator";
import { RoomNightsDividedByBookingSegmentSectionGenerator } from "./sections/RoomNightsDividedByBookingSegmentSectionGenerator";
import { TotalAvgRateSectionGenerator } from "./sections/TotalAvgRateSectionGenerator";
import { BreakfastRevenueByBookingSegmentSectionGenerator } from "./sections/BreakfastRevenueByBookingSegmentSectionGenerator";
import { CapacitySectionGenerator } from "./sections/CapacitySectionGenerator";
import { BreakfastInternalCostByBookingSegmentSectionGenerator } from "./sections/BreakfastInternalCostByBookingSegmentSectionGenerator";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { NumberInListValidationRule } from "../../../utils/th-validation/rules/NumberInListValidationRule";
import { IThDateToThPeriodConverter } from "../key-metrics/period-converter/IThDateToThPeriodConverter";
import { ThDateToThPeriodConverterFactory } from "../key-metrics/period-converter/ThDateToThPeriodConverterFactory";

import _ = require('underscore');

export class GeneralStatsReportGroupGenerator extends AReportGeneratorStrategy {
	private _startDate: ThDateDO;
	private _endDate: ThDateDO;
	private _period: YieldManagerPeriodDO;
	private _excludeVat: boolean;

	private _hotelDetails: HotelDetailsDO;
	private _keyMetricItem: KeyMetricsResultItem;

	private _loadedRoomList: RoomDO[];
	private _loadedRoomCategoryStatsList: RoomCategoryStatsDO[];
	private _periodType: number;

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
		this._startDate = new ThDateDO();
		this._startDate.buildFromObject(params.startDate);
		this._endDate = new ThDateDO();
		this._endDate.buildFromObject(params.endDate);
		this._periodType = params.periodType;

		this._excludeVat = true;
	}

	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		let dateInterval = ThDateIntervalDO.buildThDateIntervalDO(this._startDate, this._endDate);
		this._period = new YieldManagerPeriodDO();
		this._period.referenceDate = dateInterval.start;
		this._period.noDays = dateInterval.getNumberOfDays() + 1;
		
		let roomSnapshotIdList: string[] = [];
		let roomCategorySnapshotIdList: string[] = [];

		let roomRepo = this._appContext.getRepositoryFactory().getRoomRepository();
		let roomCategStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);

		let hotelGetDetails = new HotelGetDetails(this._appContext, this._sessionContext);
		hotelGetDetails.getDetails().then((hotelDetails: HotelDetailsDO) => {
			this._hotelDetails = hotelDetails;

			let reader = new KeyMetricReader(this._appContext, this._sessionContext);
			return reader.getKeyMetrics(
				new KeyMetricsReaderInputBuilder()
					.setYieldManagerPeriodDO(this._period)
					.includePreviousPeriod(false)
					.setDataAggregationType(this._periodType)
					.setCommissionOption(CommissionOption.EXCLUDE)
					.excludeVat(this._excludeVat)
					.build(),
				KeyMetricOutputType.GeneralStatsReport
			);
		}).then((reportItems: KeyMetricsResult) => {
			this._keyMetricItem = reportItems.currentItem;

			return roomRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
				maintenanceStatusList: RoomDO.inInventoryMaintenanceStatusList
			});
		}).then((roomSearchResult: RoomSearchResultRepoDO) => {
			this._loadedRoomList = roomSearchResult.roomList;

			return roomCategStatsAggregator.getUsedRoomCategoryStatsList()
		}).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
			this._loadedRoomCategoryStatsList = roomCategoryStatsList;

			let snapshotRepo = this._appContext.getRepositoryFactory().getSnapshotRepository();
			return snapshotRepo.getSnapshotList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
				thDateUtcTimestamp: dateInterval.end.getUtcTimestamp()
			});
		}).then((result: HotelInventorySnapshotSearchResultRepoDO) => {
			let snapshotList = result.snapshotList;
			if (_.isEmpty(snapshotList)) {
				resolve(true);
				return;
			}

			let hotelInventorySnapshotList = snapshotList[0];

			roomSnapshotIdList = _.map(hotelInventorySnapshotList.roomList, (roomSnapshot: RoomSnapshotDO) => {
				return roomSnapshot.id
			});
			roomCategorySnapshotIdList = _.chain(hotelInventorySnapshotList.roomList).map((roomSnapshotDO: RoomSnapshotDO) => {
				return roomSnapshotDO.categoryId;
			}).uniq().value();

			return roomRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {roomIdList: roomSnapshotIdList});
		}).then((roomSearchResult: RoomSearchResultRepoDO) => {
			this._loadedRoomList = roomSearchResult.roomList;

			return roomCategStatsAggregator.getRoomCategoryStatsList(roomCategorySnapshotIdList);
		}).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
			this._loadedRoomCategoryStatsList = roomCategoryStatsList;
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
			this._excludeVat ? this._appContext.thTranslate.translate("Yes") : this._appContext.thTranslate.translate("No");

		return {
			name: "General Stats Report",
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

	private generateSectionHeadersWithPeriods(): ReportSectionHeader {
		let periodConverter = ThDateToThPeriodConverterFactory.getConverter(this._periodType);
		let periodIdToValueGroupMap: { [index: string]: IKeyMetricValueGroup; } = {};
		var headerValues = [""];
		this._keyMetricItem.dateList.forEach((thDate: ThDateDO, index: number) => {
			let period = periodConverter.convert(thDate);
			if (this._thUtils.isUndefinedOrNull(periodIdToValueGroupMap[period.id])) {
				periodIdToValueGroupMap[period.id] = {
					period: period
				};
				this.tryUpdatePeriodMarginDisplayString(period, thDate, index);
				headerValues.push(period.displayString);
			}
			else {
				period = periodIdToValueGroupMap[period.id].period;
				let didUpdate = this.tryUpdatePeriodMarginDisplayString(period, thDate, index);
				if (didUpdate) {
					headerValues.pop();
					headerValues.push(period.displayString);
				}
			}
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
		if (index == this._keyMetricItem.dateList.length - 1 && thDate.isBefore(period.dateEnd)) {
			period.dateEnd = thDate;
			this.updatePeriodDisplayString(period);
			return true;
		}
		return false;
	}
	private updatePeriodDisplayString(period: ThPeriodDO) {
		period.displayString = period.dateStart.toString() + " - " + period.dateEnd.toString();
	}

	protected getSectionGenerators(): IReportSectionGeneratorStrategy[] {
		let homeCountry = this._hotelDetails.hotel.contactDetails.address.country;
		let reportSectionsHeader = this.generateSectionHeadersWithPeriods();
		return [
			new GuestNightsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader),
			new GuestNightsDividedByBookingSegmentSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader),
			new ArrivalsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader),
			new ArrivalsFromHomeCountrySectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader, homeCountry),
			new GuestNightsDividedByNationalitySectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader, homeCountry),
			new RoomNightsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader),
			new RoomNightsDividedByBookingSegmentSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader),
			new TotalAvgRateSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader),
			new BreakfastRevenueByBookingSegmentSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader),
			new BreakfastInternalCostByBookingSegmentSectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, reportSectionsHeader),
			new CapacitySectionGenerator(this._appContext, this._sessionContext, this._globalSummary,
				this._periodType, this._keyMetricItem, this._loadedRoomList, this._loadedRoomCategoryStatsList)
		];
	}
}