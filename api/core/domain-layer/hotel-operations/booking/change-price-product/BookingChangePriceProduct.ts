import { ThLogger, ThLogLevel } from '../../../../utils/logging/ThLogger';
import { ThError } from '../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ThUtils } from '../../../../utils/ThUtils';
import { BookingUtils } from '../../../bookings/utils/BookingUtils';
import { BookingInvoiceSync } from '../../../bookings/invoice-sync/BookingInvoiceSync';
import { BookingDO } from '../../../../data-layer/bookings/data-objects/BookingDO';
import { BookingDOConstraints } from '../../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { HotelDO } from '../../../../data-layer/hotel/data-objects/HotelDO';
import { PriceProductsContainer } from '../../../price-products/validators/results/PriceProductsContainer';
import { PriceProductIdValidator } from '../../../price-products/validators/PriceProductIdValidator';
import { CustomersContainer } from '../../../customers/validators/results/CustomersContainer';
import { CustomerIdValidator } from '../../../customers/validators/CustomerIdValidator';
import { AllotmentsContainer } from '../../../allotments/validators/results/AllotmentsContainer';
import { AllotmentIdValidator } from '../../../allotments/validators/AllotmentIdValidator';
import { RoomSearchResultRepoDO } from '../../../../data-layer/rooms/repositories/IRoomRepository';
import { RoomCategoryStatsAggregator } from '../../../room-categories/aggregators/RoomCategoryStatsAggregator';
import { RoomCategoryStatsDO } from '../../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { RoomDO } from '../../../../data-layer/rooms/data-objects/RoomDO';
import { PriceProductDO } from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import { DocumentActionDO } from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';
import { InvoiceGroupSearchResultRepoDO } from '../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { BookingWithDependencies } from '../utils/BookingWithDependencies';
import { NewBookingsValidationRules } from '../../../bookings/add-bookings/utils/NewBookingsValidationRules';
import { ValidationResultParser } from '../../../common/ValidationResultParser';
import { BookingChangePriceProductDO } from './BookingChangePriceProductDO';

import _ = require('underscore');

export class BookingChangePriceProduct {
    private _thUtils: ThUtils;
    private _bookingUtils: BookingUtils;
    private _bookingInvoiceSync: BookingInvoiceSync;

    private _inputDO: BookingChangePriceProductDO;

    private _loadedHotel: HotelDO;
    private _loadedPriceProductsContainer: PriceProductsContainer;
    private _loadedCustomersContainer: CustomersContainer;
    private _loadedAllotmentsContainer: AllotmentsContainer;
    private _loadedRoomList: RoomDO[];
    private _loadedRoomCategoryStatsList: RoomCategoryStatsDO[];
    private _loadedInvoiceGroupList: InvoiceGroupDO[];

    private _booking: BookingDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
        this._bookingUtils = new BookingUtils();
        this._bookingInvoiceSync = new BookingInvoiceSync(this._appContext, this._sessionContext);
    }

    public changePriceProduct(inputDO: BookingChangePriceProductDO): Promise<BookingDO> {
        this._inputDO = inputDO;
        return new Promise<BookingDO>((resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.changePriceProductCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.BookingChangePriceProductError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error changing price product for booking", this._inputDO, thError);
                reject(thError);
            }
        });
    }

    private changePriceProductCore(resolve: { (result: BookingDO): void }, reject: { (err: ThError): void }) {
        var validationResult = BookingChangePriceProductDO.getValidationStructure().validateStructure(this._inputDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._inputDO);
            parser.logAndReject("Error validating data for change price product on booking", reject);
            return;
        }

        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;

                var bookingRepository = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingRepository.getBookingById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._inputDO.groupBookingId, this._inputDO.bookingId);
            }).then((loadedBooking: BookingDO) => {
                this._booking = loadedBooking;

                if (!this.bookingHasValidStatus()) {
                    var thError = new ThError(ThStatusCode.BookingChangePriceProductInvalidState, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change price product: invalid booking state", this._inputDO, thError);
                    throw thError;
                }

                var priceProductValidator = new PriceProductIdValidator(this._appContext, this._sessionContext);
                return priceProductValidator.validatePriceProductId(this._inputDO.priceProductId);
            }).then((loadedPriceProductsContainer: PriceProductsContainer) => {
                this._loadedPriceProductsContainer = loadedPriceProductsContainer;

                var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
                var customerIdListToValidate = this._booking.customerIdList;
                return customerValidator.validateCustomerIdList(customerIdListToValidate);
            }).then((loadedCustomersContainer: CustomersContainer) => {
                this._loadedCustomersContainer = loadedCustomersContainer;

                var allotmentValidator = new AllotmentIdValidator(this._appContext, this._sessionContext);
                var allotmentIdListToValidate = [];
                if (!this._thUtils.isUndefinedOrNull(this._inputDO.allotmentId)
                    && _.isString(this._inputDO.allotmentId) && this._inputDO.allotmentId.length > 0) {
                    allotmentIdListToValidate = [this._inputDO.allotmentId];
                }
                return allotmentValidator.validateAllotmentIdList({
                    allotmentIdList: allotmentIdListToValidate,
                    onlyActive: true
                });
            }).then((loadedAllotmentsContainer: AllotmentsContainer) => {
                this._loadedAllotmentsContainer = loadedAllotmentsContainer;

                var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
                return roomsRepo.getRoomList({ hotelId: this._sessionContext.sessionDO.hotel.id });
            }).then((roomSearchResult: RoomSearchResultRepoDO) => {
                this._loadedRoomList = roomSearchResult.roomList;

                var roomCategStatsAggregator = new RoomCategoryStatsAggregator(this._appContext, this._sessionContext);
                return roomCategStatsAggregator.getRoomCategoryStatsList();
            }).then((roomCategoryStatsList: RoomCategoryStatsDO[]) => {
                this._loadedRoomCategoryStatsList = roomCategoryStatsList;

                this.updateBookingUsingInputParams();

                var newBookingValidationRules = new NewBookingsValidationRules(this._appContext, this._sessionContext, {
                    hotel: this._loadedHotel,
                    priceProductsContainer: this._loadedPriceProductsContainer,
                    customersContainer: this._loadedCustomersContainer,
                    allotmentsContainer: this._loadedAllotmentsContainer,
                    roomList: this._loadedRoomList,
                    roomCategoryStatsList: this._loadedRoomCategoryStatsList
                });
                return newBookingValidationRules.validateBookingList([this._booking]);
            }).then((validatedBookingList: BookingDO[]) => {
                this._booking = validatedBookingList[0];

                var invoiceGroupsRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
                return invoiceGroupsRepo.getInvoiceGroupList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._booking.groupBookingId,
                    bookingId: this._booking.id
                });
            }).then((invoiceGroupSearchResult: InvoiceGroupSearchResultRepoDO) => {
                this._loadedInvoiceGroupList = invoiceGroupSearchResult.invoiceGroupList;

                if (this.bookingHasClosedInvoice()) {
                    var thError = new ThError(ThStatusCode.BookingChangePriceProductPaidInvoice, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "change price product: paid invoice", this._inputDO, thError);
                    throw thError;
                }

                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.updateBooking({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    groupBookingId: this._booking.groupBookingId,
                    bookingId: this._booking.id,
                    versionId: this._booking.versionId
                }, this._booking);
            }).then((updatedBooking: BookingDO) => {
                this._booking = updatedBooking;
                return this._bookingInvoiceSync.syncInvoiceWithBookingPrice(updatedBooking);
            }).then((updatedGroup: InvoiceGroupDO) => {
                resolve(this._booking);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.BookingChangePriceProductError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing price products - last catch", this._inputDO, thError);
                }
                reject(thError);
            });
    }

    private bookingHasValidStatus() {
        return _.contains(BookingDOConstraints.ConfirmationStatuses_CanChangePriceProduct, this._booking.confirmationStatus);
    }

    private bookingHasClosedInvoice() {
        var bookingWithDependencies = new BookingWithDependencies();
        bookingWithDependencies.bookingDO = this._booking;
        bookingWithDependencies.priceProductsContainer = this._loadedPriceProductsContainer;
        bookingWithDependencies.allotmentsContainer = this._loadedAllotmentsContainer;
        bookingWithDependencies.roomList = this._loadedRoomList;
        bookingWithDependencies.roomCategoryStatsList = this._loadedRoomCategoryStatsList;
        bookingWithDependencies.invoiceGroupList = this._loadedInvoiceGroupList;
        return bookingWithDependencies.hasClosedInvoice();
    }

    private updateBookingUsingInputParams() {
        var oldPrice: number = this._booking.price.totalBookingPrice;

        this._booking.priceProductId = this._inputDO.priceProductId;
        this._booking.roomCategoryId = this._inputDO.roomCategoryId;
        this._booking.allotmentId = this._inputDO.allotmentId;

        var priceProduct = this._loadedPriceProductsContainer.getPriceProductById(this._inputDO.priceProductId);
        let billedCustomer = this._loadedCustomersContainer.getCustomerById(this._booking.defaultBillingDetails.customerId);
        this._bookingUtils.updateBookingPriceUsingRoomCategoryAndSavePPSnapshot(this._booking, this._loadedRoomCategoryStatsList, priceProduct, billedCustomer);

        var newPrice: number = this._booking.price.totalBookingPrice;

        this._booking.bookingHistory.logDocumentAction(DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: { oldPrice: oldPrice, newPrice: newPrice },
            actionString: "The Price Product from this booking has been changed. The old price %oldPrice% has become %newPrice%.",
            userId: this._sessionContext.sessionDO.user.id
        }));
    }
}