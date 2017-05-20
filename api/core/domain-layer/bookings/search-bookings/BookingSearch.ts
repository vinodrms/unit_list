import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { BookingSearchDO } from './BookingSearchDO';
import { TransientBookingItemDO } from './TransientBookingItemDO';
import { ValidationResultParser } from '../../common/ValidationResultParser';
import { BookingIntervalValidator } from '../validators/BookingIntervalValidator';
import { RoomDO } from '../../../data-layer/rooms/data-objects/RoomDO';
import { RoomSearchResultRepoDO } from '../../../data-layer/rooms/repositories/IRoomRepository';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { BookingDataLoaderFactory } from './utils/data-loader/BookingDataLoaderFactory';
import { IBookingDataLoader } from './utils/data-loader/IBookingDataLoader';
import { BookingSearchDependencies } from './utils/data-loader/results/BookingSearchDependencies';
import { BookingDependenciesFilter } from './utils/data-filter/BookingDependenciesFilter';
import { BookingOccupancyCalculator } from './utils/occupancy-calculator/BookingOccupancyCalculator';
import { IBookingOccupancy } from './utils/occupancy-calculator/results/IBookingOccupancy';
import { RoomCategoryStatsAggregator } from '../../room-categories/aggregators/RoomCategoryStatsAggregator';
import { RoomCategoryStatsDO, RoomCategoryCapacityDO } from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { BookingSearchResultBuilder } from './utils/result-builder/BookingSearchResultBuilder';
import { BookingSearchResult } from './utils/result-builder/BookingSearchResult';

export class BookingSearch {
    private _searchParams: BookingSearchDO;

    private _loadedHotel: HotelDO;
    private _loadedRoomList: RoomDO[];
    private _loadedBookingSearchDependencies: BookingSearchDependencies;
    private _loadedBookingOccupancy: IBookingOccupancy;
    private _loadedRoomCategoryStatsList: RoomCategoryStatsDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public search(searchParams: BookingSearchDO): Promise<BookingSearchResult> {
        this._searchParams = searchParams;
        return new Promise<BookingSearchResult>((resolve: { (result: BookingSearchResult): void }, reject: { (err: ThError): void }) => {
            this.searchCore(resolve, reject);
        });
    }

    private searchCore(resolve: { (result: BookingSearchResult): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingSearchDO.getValidationStructure().validateStructure(this._searchParams);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._searchParams);
            parser.logAndReject("Error validating data search bookings", reject);
            return;
        }

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;

                var intervalValidator = new BookingIntervalValidator(loadedHotel);
                return intervalValidator.validateBookingInterval({
                    bookingInterval: this._searchParams.interval,
                    isNewBooking: true
                });
            }).then((validatedBookingInterval: ThDateIntervalDO) => {
                this._searchParams.interval = validatedBookingInterval;

                var dataLoaderFactory = new BookingDataLoaderFactory(this._appContext, this._sessionContext);
                var dataLoader: IBookingDataLoader = dataLoaderFactory.getDataLoader(this._searchParams.customerId);
                return dataLoader.loadData();
            }).then((bookingSearchData: BookingSearchDependencies) => {
                this._loadedBookingSearchDependencies = bookingSearchData;

                var bookingDependenciesFilter = new BookingDependenciesFilter(this._appContext, this._sessionContext, {
                    hotel: this._loadedHotel,
                    interval: this._searchParams.interval,
                    configCapacity: this._searchParams.configCapacity
                });
                return bookingDependenciesFilter.filterDependencies(this._loadedBookingSearchDependencies);
            }).then((filteredBookingSearchData: BookingSearchDependencies) => {
                this._loadedBookingSearchDependencies = filteredBookingSearchData;

                var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
                return roomsRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id });
            }).then((roomSearchResult: RoomSearchResultRepoDO) => {
                this._loadedRoomList = roomSearchResult.roomList;

                var transientBookingList = TransientBookingItemDO.convertToBookingList(this._searchParams.transientBookingList);
                var occupancyCalculator = new BookingOccupancyCalculator(this._appContext, this._sessionContext, this._loadedRoomList);
                return occupancyCalculator.compute(this._searchParams.interval, transientBookingList, this._searchParams.bookingIdToOmit);
            }).then((bookingOccupancy: IBookingOccupancy) => {
                this._loadedBookingOccupancy = bookingOccupancy;

                var roomCategStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);
                return roomCategStatsAggregator.getRoomCategoryStatsList();
            }).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
                this._loadedRoomCategoryStatsList = roomCategoryStatsList;

                var resultBuilder = new BookingSearchResultBuilder(this._appContext, this._sessionContext);
                return resultBuilder.build({
                    bookingOccupancy: this._loadedBookingOccupancy,
                    bookingSearchDependencies: this._loadedBookingSearchDependencies,
                    roomCategoryStatsList: this._loadedRoomCategoryStatsList,
                    searchParams: this._searchParams,
                    hotel: this._loadedHotel
                });
            }).then((searchResult: BookingSearchResult) => {
                resolve(searchResult);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingSearchError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error searching bookings", this._searchParams, thError);
                }
                reject(thError);
            });
    }
}