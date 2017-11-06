import _ = require('underscore');
import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThTimestampDO } from '../../../../utils/th-dates/data-objects/ThTimestampDO';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { AssignRoomDO } from './AssignRoomDO';
import { BookingDO } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { BookingSearchResultRepoDO } from '../../../../data-layer/bookings/repositories/IBookingRepository';
import { RoomCategoryStatsAggregator } from '../../../room-categories/aggregators/RoomCategoryStatsAggregator';
import { RoomCategoryStatsDO } from '../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { RoomDO } from '../../../../data-layer/rooms/data-objects/RoomDO';
import { RoomSearchResultRepoDO } from '../../../../data-layer/rooms/repositories/IRoomRepository';
import { PriceProductsContainer } from '../../../price-products/validators/results/PriceProductsContainer';
import { IAssignRoomStrategy } from './strategies/IAssignRoomStrategy';
import { CheckInStrategy } from './strategies/CheckInStrategy';
import { ReserveRoomStrategy } from './strategies/ReserveRoomStrategy';
import { ChangeRoomStrategy } from './strategies/ChangeRoomStrategy';
import { HotelTime } from '../../common/hotel-time/HotelTime';
import { BusinessValidationRuleContainer } from '../../../common/validation-rules/BusinessValidationRuleContainer';
import { BookingRoomCategoryValidationRule } from '../../../bookings/validators/validation-rules/booking/BookingRoomCategoryValidationRule';
import { BookingOccupancyCalculator } from '../../../bookings/search-bookings/utils/occupancy-calculator/BookingOccupancyCalculator';
import { IBookingOccupancy } from '../../../bookings/search-bookings/utils/occupancy-calculator/results/IBookingOccupancy';
import { BookingUtils } from '../../../bookings/utils/BookingUtils';
import { BookingWithDependencies } from '../../booking/utils/BookingWithDependencies';
import { BookingWithDependenciesLoader } from '../../booking/utils/BookingWithDependenciesLoader';
import { InvoiceDO } from '../../../../data-layer/invoices/data-objects/InvoiceDO';
import { BookingInvoiceSync } from '../../../bookings/invoice-sync/BookingInvoiceSync';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';

export class AssignRoom {
    private bookingUtils: BookingUtils;
    private assignRoomStrategy: IAssignRoomStrategy;
    private assignRoomDO: AssignRoomDO;

    private needsPriceRecomputing: boolean;

    private bookingWithDependencies: BookingWithDependencies;
    private currentHotelTimestamp: ThTimestampDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this.bookingUtils = new BookingUtils();
    }

    public checkIn(assignRoomDO: AssignRoomDO): Promise<BookingDO> {
        this.assignRoomStrategy = new CheckInStrategy(this._appContext, this._sessionContext);
        return this.assignRoom(assignRoomDO);
    }
    public reserveRoom(assignRoomDO: AssignRoomDO): Promise<BookingDO> {
        this.assignRoomStrategy = new ReserveRoomStrategy(this._appContext, this._sessionContext);
        return this.assignRoom(assignRoomDO);
    }
    public changeRoom(assignRoomDO: AssignRoomDO): Promise<BookingDO> {
        this.assignRoomStrategy = new ChangeRoomStrategy(this._appContext, this._sessionContext);
        return this.assignRoom(assignRoomDO);
    }

    private assignRoom(assignRoomDO: AssignRoomDO): Promise<BookingDO> {
        this.assignRoomDO = assignRoomDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            this.assignRoomCore(resolve, reject);
        });
    }
    private assignRoomCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = AssignRoomDO.getValidationStructure().validateStructure(this.assignRoomDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this.assignRoomDO);
            parser.logAndReject("Error validating assign room fields", reject);
            return;
        }
        var bookingLoader = new BookingWithDependenciesLoader(this._appContext, this._sessionContext);
        return bookingLoader.load(this.assignRoomDO.groupBookingId, this.assignRoomDO.bookingId)
            .then((bookingWithDependencies: BookingWithDependencies) => {
                this.bookingWithDependencies = bookingWithDependencies;

                var hotelTime = new HotelTime(this._appContext, this._sessionContext);
                return hotelTime.getTimestamp();
            }).then((timestamp: ThTimestampDO) => {
                this.currentHotelTimestamp = timestamp;

                this.updateBookingWithInputParams();
                return this.assignRoomStrategy.updateAdditionalFields({
                    assignRoomDO: this.assignRoomDO,
                    currentHotelTimestamp: this.currentHotelTimestamp,
                    booking: this.bookingWithDependencies.bookingDO,
                    roomList: this.bookingWithDependencies.roomList,
                    roomCategoryStatsList: this.bookingWithDependencies.roomCategoryStatsList
                });
            }).then((updatedBooking: BookingDO) => {
                this.bookingWithDependencies.bookingDO = updatedBooking;

                var bookingValidationRule = new BusinessValidationRuleContainer([
                    new BookingRoomCategoryValidationRule({
                        priceProductsContainer: this.bookingWithDependencies.priceProductsContainer,
                        roomCategoryStatsList: this.bookingWithDependencies.roomCategoryStatsList,
                        roomList: this.bookingWithDependencies.roomList
                    })
                ]);
                return bookingValidationRule.isValidOn(this.bookingWithDependencies.bookingDO);
            }).then((validatedBooking: BookingDO) => {
                this.bookingWithDependencies.bookingDO = validatedBooking;
                if (this.needsPriceRecomputing && this.bookingWithDependencies.hasClosedInvoice()) {
                    var thError = new ThError(ThStatusCode.AssignRoomPaidInvoice, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Info, "assign room: paid invoice", this.assignRoomDO, thError);
                    throw thError;
                }
                this.updateBookingPriceIfNecessary();

                var occupancyCalculator = new BookingOccupancyCalculator(this._appContext, this._sessionContext, this.bookingWithDependencies.roomList);
                return occupancyCalculator.compute(this.bookingWithDependencies.bookingDO.interval, [], this.bookingWithDependencies.bookingDO.id);
            }).then((bookingOccupancy: IBookingOccupancy) => {
                if (bookingOccupancy.getOccupancyForRoomId(this.assignRoomDO.roomId) > 0) {
                    var thError = new ThError(ThStatusCode.AssignRoomOccupied, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Info, "assigned occupied room", this.assignRoomDO, thError);
                    throw thError;
                }

                var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingRepository.getBookingList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_CheckedId,
                    roomId: this.assignRoomDO.roomId
                });
            }).then((searchResult: BookingSearchResultRepoDO) => {
                if (searchResult.bookingList.length > 0 && this.assignRoomStrategy.validateAlreadyCheckedInBooking()) {
                    var thError = new ThError(ThStatusCode.AssignRoomCheckedInWrongInterval, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Info, "assigned checked in room on a different interval", this.assignRoomDO, thError);
                    throw thError;
                }

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this.bookingWithDependencies.bookingDO.groupBookingId,
                    bookingId: this.bookingWithDependencies.bookingDO.id,
                    versionId: this.bookingWithDependencies.bookingDO.versionId
                }, this.bookingWithDependencies.bookingDO);
            }).then((updatedBooking: BookingDO) => {
                this.bookingWithDependencies.bookingDO = updatedBooking;

                return this.assignRoomStrategy.generateInvoiceIfNecessary(this.bookingWithDependencies.bookingDO);
            }).then((bookingWithInvoice: BookingDO) => {
                return this.updateInvoiceAmountToPayIfNecessary();
            }).then((invoice: InvoiceDO) => {
                resolve(this.bookingWithDependencies.bookingDO);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.AssignRoomError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error assigning room", this._sessionContext, thError);
                }
                reject(thError);
            });
    }

    private updateBookingWithInputParams() {
        this.needsPriceRecomputing = false;
        this.bookingWithDependencies.bookingDO.roomId = this.assignRoomDO.roomId;
        if (!this._appContext.thUtils.isUndefinedOrNull(this.assignRoomDO.roomCategoryId) && _.isString(this.assignRoomDO.roomCategoryId)) {
            if (this.assignRoomDO.roomCategoryId !== this.bookingWithDependencies.bookingDO.roomCategoryId) {
                this.bookingWithDependencies.bookingDO.roomCategoryId = this.assignRoomDO.roomCategoryId;
                this.needsPriceRecomputing = true;
            }
        }
    }
    private updateBookingPriceIfNecessary() {
        if (!this.needsPriceRecomputing) {
            return;
        }
        var oldPrice: number = this.bookingWithDependencies.bookingDO.price.totalBookingPrice;
        this.bookingUtils.updateBookingPriceUsingRoomCategoryAndSavePPSnapshot(this.bookingWithDependencies.bookingDO,
            this.bookingWithDependencies.roomCategoryStatsList, this.bookingWithDependencies.priceProductDO,
            this.bookingWithDependencies.billingCustomer);
        var newPrice: number = this.bookingWithDependencies.bookingDO.price.totalBookingPrice;
        this.bookingWithDependencies.bookingDO.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: { oldPrice: oldPrice, newPrice: newPrice },
            actionString: "Due to the recent change, the old price %oldPrice% has become %newPrice%.",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
    private updateInvoiceAmountToPayIfNecessary(): Promise<InvoiceDO> {
        if (!this.needsPriceRecomputing) {
            return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
                resolve(this.bookingWithDependencies.getInvoice());
            });
        }
        let bookingInvoiceSync = new BookingInvoiceSync(this._appContext, this._sessionContext);
        return bookingInvoiceSync.syncInvoiceWithBookingPrice(this.bookingWithDependencies.bookingDO);
    }
}
