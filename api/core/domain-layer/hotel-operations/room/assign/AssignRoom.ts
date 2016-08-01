import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {ThTimestampDO} from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {AssignRoomDO} from './AssignRoomDO';
import {BookingDO} from '../../../../data-layer/bookings/data-objects/BookingDO';
import {BookingDOConstraints} from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {BookingSearchResultRepoDO} from '../../../../data-layer/bookings/repositories/IBookingRepository';
import {RoomCategoryStatsAggregator} from '../../../room-categories/aggregators/RoomCategoryStatsAggregator';
import {RoomCategoryStatsDO} from '../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {RoomDO} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {RoomSearchResultRepoDO} from '../../../../data-layer/rooms/repositories/IRoomRepository';
import {PriceProductsContainer} from '../../../price-products/validators/results/PriceProductsContainer';
import {IAssignRoomStrategy} from './strategies/IAssignRoomStrategy';
import {CheckInStrategy} from './strategies/CheckInStrategy';
import {ReserveRoomStrategy} from './strategies/ReserveRoomStrategy';
import {ChangeRoomStrategy} from './strategies/ChangeRoomStrategy';
import {HotelTime} from '../../common/hotel-time/HotelTime';
import {BusinessValidationRuleContainer} from '../../../common/validation-rules/BusinessValidationRuleContainer';
import {BookingRoomCategoryValidationRule} from '../../../bookings/validators/validation-rules/booking/BookingRoomCategoryValidationRule';
import {BookingOccupancyCalculator} from '../../../bookings/search-bookings/utils/occupancy-calculator/BookingOccupancyCalculator';
import {IBookingOccupancy} from '../../../bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import {BookingUtils} from '../../../bookings/utils/BookingUtils';

import _ = require('underscore');

export class AssignRoom {
    private _thUtils: ThUtils;
    private _bookingUtils: BookingUtils;

    private _assignRoomStrategy: IAssignRoomStrategy;
    private _assignRoomDO: AssignRoomDO;

    private _needsPriceRecomputing: boolean;

    private _booking: BookingDO;
    private _priceProductsContainer: PriceProductsContainer;
    private _currentHotelTimestamp: ThTimestampDO;
    private _loadedRoomCategoryStatsList: RoomCategoryStatsDO[];
    private _loadedRoomList: RoomDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
        this._bookingUtils = new BookingUtils();
    }

    public checkIn(assignRoomDO: AssignRoomDO): Promise<BookingDO> {
        this._assignRoomStrategy = new CheckInStrategy(this._appContext, this._sessionContext);
        return this.assignRoom(assignRoomDO);
    }
    public reserveRoom(assignRoomDO: AssignRoomDO): Promise<BookingDO> {
        this._assignRoomStrategy = new ReserveRoomStrategy(this._appContext, this._sessionContext);
        return this.assignRoom(assignRoomDO);
    }
    public changeRoom(assignRoomDO: AssignRoomDO): Promise<BookingDO> {
        this._assignRoomStrategy = new ChangeRoomStrategy(this._appContext, this._sessionContext);
        return this.assignRoom(assignRoomDO);
    }

    private assignRoom(assignRoomDO: AssignRoomDO): Promise<BookingDO> {
        this._assignRoomDO = assignRoomDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.assignRoomCore(resolve, reject);
        });
    }
    private assignRoomCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = AssignRoomDO.getValidationStructure().validateStructure(this._assignRoomDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._assignRoomDO);
            parser.logAndReject("Error validating assign room fields", reject);
            return;
        }
        var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._assignRoomDO.groupBookingId, this._assignRoomDO.bookingId)
            .then((booking: BookingDO) => {
                this._booking = booking;
                this._priceProductsContainer = new PriceProductsContainer([this._booking.priceProductSnapshot]);

                var hotelTime = new HotelTime(this._appContext, this._sessionContext);
                return hotelTime.getTimestamp();
            }).then((timestamp: ThTimestampDO) => {
                this._currentHotelTimestamp = timestamp;

                var roomCategStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);
                return roomCategStatsAggregator.getRoomCategoryStatsList();
            }).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
                this._loadedRoomCategoryStatsList = roomCategoryStatsList;

                var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
                return roomsRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id });
            }).then((roomSearchResult: RoomSearchResultRepoDO) => {
                this._loadedRoomList = roomSearchResult.roomList;

                this.updateBookingWithInputParams();
                return this._assignRoomStrategy.updateAdditionalFields({
                    assignRoomDO: this._assignRoomDO,
                    currentHotelTimestamp: this._currentHotelTimestamp,
                    booking: this._booking,
                    roomList: this._loadedRoomList
                });
            }).then((updatedBooking: BookingDO) => {
                this._booking = updatedBooking;

                var bookingValidationRule = new BusinessValidationRuleContainer([
                    new BookingRoomCategoryValidationRule({
                        priceProductsContainer: this._priceProductsContainer,
                        roomCategoryStatsList: this._loadedRoomCategoryStatsList,
                        roomList: this._loadedRoomList
                    })
                ]);
                return bookingValidationRule.isValidOn(this._booking);
            }).then((validatedBooking: BookingDO) => {
                this._booking = validatedBooking;
                this.updateBookingPriceIfNecessary();

                var occupancyCalculator = new BookingOccupancyCalculator(this._appContext, this._sessionContext, this._loadedRoomList);
                return occupancyCalculator.compute(this._booking.interval, [], this._booking.bookingId);
            }).then((bookingOccupancy: IBookingOccupancy) => {
                if (bookingOccupancy.getOccupancyForRoomId(this._assignRoomDO.roomId) > 0) {
                    var thError = new ThError(ThStatusCode.AssignRoomOccupied, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Info, "assigned occupied room", this._assignRoomDO, thError);
                    throw thError;
                }

                var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CheckedId,
                    roomId: this._assignRoomDO.roomId
                });
            }).then((searchResult: BookingSearchResultRepoDO) => {
                if (searchResult.bookingList.length > 0 && this._assignRoomStrategy.validateAlreadyCheckedInBooking()) {
                    var thError = new ThError(ThStatusCode.AssignRoomCheckedInWrongInterval, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Info, "assigned checked in room on a different interval", this._assignRoomDO, thError);
                    throw thError;
                }

                return this._assignRoomStrategy.generateInvoiceIfNecessary(this._booking);
            }).then((bookingWithInvoice: BookingDO) => {
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._booking.groupBookingId,
                    bookingId: this._booking.bookingId,
                    versionId: this._booking.versionId
                }, this._booking);
            }).then((updatedBooking: BookingDO) => {
                resolve(updatedBooking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.AssignRoomError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error assigning room", this._sessionContext, thError);
                }
                reject(thError);
            });
    }

    private updateBookingWithInputParams() {
        this._needsPriceRecomputing = false;
        this._booking.roomId = this._assignRoomDO.roomId;
        if (!this._thUtils.isUndefinedOrNull(this._assignRoomDO.roomCategoryId) && _.isString(this._assignRoomDO.roomCategoryId)) {
            if (this._assignRoomDO.roomCategoryId !== this._booking.roomCategoryId) {
                this._booking.roomCategoryId = this._assignRoomDO.roomCategoryId;
                this._needsPriceRecomputing = true;
            }
        }
    }
    private updateBookingPriceIfNecessary() {
        if (!this._needsPriceRecomputing) {
            return;
        }
        this._bookingUtils.updateBookingPriceUsingRoomCategory(this._booking);
    }
}