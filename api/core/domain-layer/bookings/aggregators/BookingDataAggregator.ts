import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingSearchResultRepoDO, BookingSearchCriteriaRepoDO} from '../../../data-layer/bookings/repositories/IBookingRepository';
import {RoomCategoryStatsAggregator} from '../../../domain-layer/room-categories/aggregators/RoomCategoryStatsAggregator';
import {RoomCategoryStatsDO} from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {CustomerSearchResultRepoDO} from '../../../data-layer/customers/repositories/ICustomerRepository';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {TaxDO} from '../../../data-layer/taxes/data-objects/TaxDO';
import {TaxResponseRepoDO} from '../../../data-layer/taxes/repositories/ITaxRepository';
import {BedSearchResultRepoDO} from '../../../data-layer/beds/repositories/IBedRepository';
import {BedMetaDO} from '../../../data-layer/room-categories/data-objects/bed-config/BedMetaDO';
import {BedDO, BedStorageType} from '../../../data-layer/common/data-objects/bed/BedDO';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductSearchResultRepoDO} from '../../../data-layer/add-on-products/repositories/IAddOnProductRepository';
import {AddOnProductCategoryDO} from '../../../data-layer/common/data-objects/add-on-product/AddOnProductCategoryDO';
import {BookingAggregatedDataContainer} from './BookingAggregatedDataContainer';
import {BookingAggregatedData} from './BookingAggregatedData';

export interface BookingDataAggregatorQuery {
    groupBookingId?: string;
    bookingIdList?: string[];
}

export class BookingDataAggregator {

    private _hotel: HotelDO;
    private _bookingList: BookingDO[];
    private _roomCategoryStatsList: RoomCategoryStatsDO[];
    private _customerList: CustomerDO[];
    private _bedList: BedDO[];
    private _addOnProductList: AddOnProductDO[];
    private _addOnProductCategoryList: AddOnProductCategoryDO[];
    private _vatList: TaxDO[];
    private _otherTaxesList: TaxDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getBookingAggregatedDataContainer(query: BookingDataAggregatorQuery): Promise<BookingAggregatedDataContainer> {
        return new Promise<BookingAggregatedDataContainer>((resolve: { (result: BookingAggregatedDataContainer): void }, reject: { (err: ThError): void }) => {
            this.getBookingAggregatedDataContainerCore(resolve, reject, query);
        });
    }
    private getBookingAggregatedDataContainerCore(resolve: { (result: BookingAggregatedDataContainer): void }, reject: { (err: ThError): void }, query: BookingDataAggregatorQuery) {
        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id).then((loadedHotel: HotelDO) => {
            this._hotel = loadedHotel;

            var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingsRepo.getBookingList({ hotelId: this._hotel.id }, query);
        }).then((result: BookingSearchResultRepoDO) => {
            this._bookingList = result.bookingList;
            var roomCategStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);

            return roomCategStatsAggregator.getRoomCategoryStatsList(this.getDistinctRoomCategoryIdListFromBookingList());
        }).then((result: RoomCategoryStatsDO[]) => {
            this._roomCategoryStatsList = result;

            return this._appContext.getRepositoryFactory().getCustomerRepository().getCustomerList({ hotelId: this._hotel.id }, { customerIdList: this.getDistinctCustomerIdListFromBookingList() });
        }).then((result: CustomerSearchResultRepoDO) => {
            this._customerList = result.customerList;

            return this._appContext.getRepositoryFactory().getTaxRepository().getTaxList({ hotelId: this._hotel.id });
        }).then((result: TaxResponseRepoDO) => {
            this._vatList = result.vatList;
            this._otherTaxesList = result.otherTaxList;

            return this._appContext.getRepositoryFactory().getBedRepository().getBedList({ hotelId: this._hotel.id }, { bedIdList: this.getDistinctBedIdListFromBookingList() });
        }).then((result: BedSearchResultRepoDO) => {
            this._bedList = _.filter(result.bedList, (bed: BedDO) => {
                return bed.storageType === BedStorageType.Stationary;
            });

            return this._appContext.getRepositoryFactory().getAddOnProductRepository().getAddOnProductList({ hotelId: this._hotel.id }, { addOnProductIdList: this.getDistinctAddOnProductIdListFromBookingList() });
        }).then((result: AddOnProductSearchResultRepoDO) => {
            this._addOnProductList = result.addOnProductList;

            return this._appContext.getRepositoryFactory().getSettingsRepository().getAddOnProductCategories();
        }).then((result: AddOnProductCategoryDO[]) => {
            this._addOnProductCategoryList = result;
            
            resolve(this.buildBookingAggregatedDataContainerFromLoadedData());
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.BookingConfirmationErrorGettingData, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error fetching booking confirmation data", query, thError);
            }
            reject(thError);
        });
    }

    private getDistinctRoomCategoryIdListFromBookingList():string[] {
        return _.chain(this._bookingList).map((booking: BookingDO) => {
            return booking.roomCategoryId;
        }).uniq().value();
    }
    private getDistinctCustomerIdListFromBookingList():string[] {
        return _.chain(this._bookingList).map((booking: BookingDO) => {
            return booking.customerIdList;
        }).flatten().uniq().value();
    }
    private getDistinctBedIdListFromBookingList():string[] {
        return _.chain(this._roomCategoryStatsList).map((roomCategoryStats: RoomCategoryStatsDO) => {
            return _.map(roomCategoryStats.roomCategory.bedConfig.bedMetaList, (bedMeta: BedMetaDO) => {
                return bedMeta.bedId;
            });
        }).flatten().uniq().value();
    }
    private getDistinctAddOnProductIdListFromBookingList():string[] {
        return _.chain(this._bookingList).map((booking: BookingDO) => {
            return booking.priceProductSnapshot.addOnProductIdList;
        }).flatten().uniq().value();
    }

    private buildBookingAggregatedDataContainerFromLoadedData(): BookingAggregatedDataContainer {
        var bookingAggregatedDataContainer = new BookingAggregatedDataContainer();
        bookingAggregatedDataContainer.hotel = this._hotel;

        var bookingAggregatedDataList = [];
        _.forEach(this._bookingList, (booking: BookingDO) => {
            var bookingAggregatedData = new BookingAggregatedData();
            bookingAggregatedData.booking = booking;

            bookingAggregatedData.roomCategoryStats = _.find(this._roomCategoryStatsList, (roomCategoryStats: RoomCategoryStatsDO) => {
                return roomCategoryStats.roomCategory.id === booking.roomCategoryId;
            });
            bookingAggregatedData.customerList = _.filter(this._customerList, (customer: CustomerDO) => {
                return _.contains(booking.customerIdList, customer.id);
            });
            bookingAggregatedData.vatList = _.filter(this._vatList, (vat: TaxDO) => {
                return _.contains(booking.priceProductSnapshot.taxIdList, vat.id);
            });
            bookingAggregatedData.otherTaxes = _.filter(this._otherTaxesList, (otherTax: TaxDO) => {
                return _.contains(booking.priceProductSnapshot.taxIdList, otherTax.id);
            });
            var bookingBedIdList = _.map(bookingAggregatedData.roomCategoryStats.roomCategory.bedConfig.bedMetaList, (bedMeta: BedMetaDO) => {
                return bedMeta.bedId;
            });
            bookingAggregatedData.bedList = _.filter(this._bedList, (bed: BedDO) => {
                return _.contains(bookingBedIdList, bed.id);
            });
            bookingAggregatedData.addOnProductList = _.filter(this._addOnProductList, (aop: AddOnProductDO) => {
                return _.contains(booking.priceProductSnapshot.addOnProductIdList, aop.id);
            });
            bookingAggregatedData.addOnProductCategoyList = this._addOnProductCategoryList;
            bookingAggregatedDataList.push(bookingAggregatedData);
        });
        bookingAggregatedDataContainer.bookingAggregatedDataList = bookingAggregatedDataList;
        
        return bookingAggregatedDataContainer;
    }
}