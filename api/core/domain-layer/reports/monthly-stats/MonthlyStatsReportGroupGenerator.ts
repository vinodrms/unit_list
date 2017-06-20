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
import { MonthlyStatsReportNoOfNightsSectionGenerator } from "./sections/MonthlyStatsReportNoOfNightsSectionGenerator";
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

export class MonthlyStatsReportGroupGenerator extends AReportGeneratorStrategy {
	private static MaxBookings = 2000;

	private _date: ThDateDO;

	private _roomList: RoomDO[];
	private _roomCategoryStatsList: RoomCategoryStatsDO[];
	private _bookingList: BookingDO[];
	private _hotelDetails: HotelDetailsDO;
	private _customerIdToCountryMap: { [index: string]: string; };

	protected getParamsValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "date",
				validationStruct: CommonValidationStructures.getThDateDOValidationStructure()
			},
		]);
	}
	protected loadParameters(params: any) {
		this._date = new ThDateDO();
		this._date.buildFromObject(params.date);
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

				let lazyLoad = new LazyLoadRepoDO();
				let period: ThPeriodDO =
					ThDateToThPeriodConverterFactory.getConverter(ThPeriodType.Month).convert(this._date);

				let interval = new ThDateIntervalDO();
				interval.start = period.dateStart;
				interval.end = period.dateEnd;

				let bookingSearchCriteria: BookingSearchCriteriaRepoDO = {
					confirmationStatusList: [BookingConfirmationStatus.CheckedOut],
					interval: interval
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

				this._customerIdToCountryMap = {};

				_.forEach(customerList, (customer: CustomerDO) => {
					let customerAddress = customer.customerDetails.getAddress();
					if (!_.isString(this._customerIdToCountryMap[customer.id]) &&
						_.isString(customer.customerDetails.getAddress().country.name)) {
						this._customerIdToCountryMap[customer.id] = customerAddress.country.name;
					}
				});
				
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
		var dateKey: string = this._appContext.thTranslate.translate("Date");
		var displayParams = {};
		displayParams[dateKey] = this._date
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
			new MonthlyStatsReportNoOfNightsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._bookingList),
			new MonthlyStatsReportNightsDividedByPurposeSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._bookingList),
			new MonthlyStatsReportNightsDividedByNationalitySectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._bookingList, this._customerIdToCountryMap),
			new MonthlyStatsReportArrivalsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._hotelDetails, this._bookingList, this._customerIdToCountryMap),
			new MonthlyStatsReportRoomNightsSectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._bookingList),
			new MonthlyStatsReportCapacitySectionGenerator(this._appContext, this._sessionContext, this._globalSummary, this._roomList, this._roomCategoryStatsList),
			
		];
	}
}