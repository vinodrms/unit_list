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
import { MonthlyStatsReportNightsDividedByPurposeSectionGenerator } from "./sections/MonthlyStatsReportNightsDividedByPurposeSectionGenerator";
import { MonthlyStatsReportNightsDividedByNationalitySectionGenerator } from "./sections/MonthlyStatsReportNightsDividedByNationalitySectionGenerator";
import { MonthlyStatsReportArrivalsSectionGenerator } from "./sections/MonthlyStatsReportArrivalsSectionGenerator";
import { CustomerSearchResultRepoDO } from "../../../data-layer/customers/repositories/ICustomerRepository";
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { MonthlyStatsReportRoomNightsSectionGenerator } from "./sections/MonthlyStatsReportRoomNightsSectionGenerator";
import { MonthlyStatsReportCapacitySectionGenerator } from "./sections/MonthlyStatsReportCapacitySectionGenerator";
import { RoomDO } from "../../../data-layer/rooms/data-objects/RoomDO";
import { RoomSearchResultRepoDO } from "../../../data-layer/rooms/repositories/IRoomRepository";
import { RoomCategoryStatsAggregator } from "../../room-categories/aggregators/RoomCategoryStatsAggregator";
import { RoomCategoryStatsDO } from "../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO";
import { CountryDO } from "../../../data-layer/common/data-objects/country/CountryDO";
import { CountryContainer } from "./utils/CountryContainer";
import { MonthlyStatsReportNoOfGuestNightsSectionGenerator } from "./sections/MonthlyStatsReportNoOfGuestNightsSectionGenerator";
import { TaxResponseRepoDO } from "../../../data-layer/taxes/repositories/ITaxRepository";
import { TaxDO } from "../../../data-layer/taxes/data-objects/TaxDO";

export class MonthlyStatsReportGroupGenerator extends AReportGeneratorStrategy {
	private static MaxBookings = 2000;

	private _startDate: ThDateDO;
	private _endDate: ThDateDO;

	private _interval: ThDateIntervalDO;
	private _roomList: RoomDO[];
	private _roomCategoryStatsList: RoomCategoryStatsDO[];
	private _bookingList: BookingDO[];
	private _hotelDetails: HotelDetailsDO;
	private _vatTaxList: TaxDO[];

	private _countryContainer: CountryContainer;

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
	}

	protected loadDependentDataCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		let roomsRepository = this._appContext.getRepositoryFactory().getRoomRepository();
		let customerRepository = this._appContext.getRepositoryFactory().getCustomerRepository();
		let bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
		let hotelRepo = this._appContext.getRepositoryFactory().getHotelRepository();

		let roomCategoryStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);

		hotelRepo.getHotelById(this._sessionContext.sessionDO.hotel.id)
			.then((hotelDO: HotelDO) => {
				var hotelDetailsBuilder = new HotelDetailsBuilder(this._sessionContext, hotelDO);
				return hotelDetailsBuilder.build();
			})
			.then((details: HotelDetailsDO) => {
				this._hotelDetails = details;

				this._interval = new ThDateIntervalDO();
				this._interval.start = this._startDate;
				this._interval.end = this._endDate;

				let bookingSearchCriteria: BookingSearchCriteriaRepoDO = {
					confirmationStatusList: [BookingConfirmationStatus.CheckedOut],
					interval: this._interval
				};

				return bookingsRepo.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id },
					bookingSearchCriteria);

			}).then((bookingMetaRsp: BookingSearchResultRepoDO) => {
				this._bookingList = bookingMetaRsp.bookingList;

				let customerIdList = _.chain(this._bookingList).map((booking: BookingDO) => {
					return booking.customerIdList;
				}).flatten().uniq();

				return customerRepository.getCustomerList({ hotelId: this._sessionContext.sessionDO.hotel.id }, customerIdList);
			}).then((result: CustomerSearchResultRepoDO) => {
				let customerList = result.customerList;

				this._countryContainer = new CountryContainer(customerList);

				return roomsRepository.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id });
			}).then((result: RoomSearchResultRepoDO) => {
				this._roomList = result.roomList;

				return roomCategoryStatsAggregator.getRoomCategoryStatsList();
			}).then((result: RoomCategoryStatsDO[]) => {
				this._roomCategoryStatsList = result;

				resolve(true);
			}).catch(e => {
				reject(e);
			});


	}

	protected getMeta(): ReportGroupMeta {
		var startDateKey: string = this._appContext.thTranslate.translate("Start Date");
		var endDateKey: string = this._appContext.thTranslate.translate("End Date");
		var displayParams = {};
		displayParams[startDateKey] = this._startDate;
		displayParams[endDateKey] = this._endDate;

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

		return [
			new MonthlyStatsReportNoOfGuestNightsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, 
				this._bookingList),
			
			new MonthlyStatsReportNightsDividedByPurposeSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, 
				this._bookingList),
			
			new MonthlyStatsReportNightsDividedByNationalitySectionGenerator(this._appContext, this._sessionContext, this._globalSummary, 
				this._hotelDetails, this._bookingList, this._countryContainer),
			
			new MonthlyStatsReportArrivalsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, 
				this._hotelDetails, this._bookingList, this._countryContainer),
			
			new MonthlyStatsReportRoomNightsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, 
				this._bookingList),
			
			new MonthlyStatsReportCapacitySectionGenerator(this._appContext, this._sessionContext, this._globalSummary, 
				this._roomList, this._roomCategoryStatsList),

		];
	}
}