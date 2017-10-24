import _ = require('underscore');
import { ThLogger, ThLogLevel } from '../../../utils/logging/ThLogger';
import { ThError } from '../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../utils/th-responses/ThResponse';
import { AppContext } from '../../../utils/AppContext';
import { SessionContext } from '../../../utils/SessionContext';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';
import { GroupBookingInputChannel, BookingDO } from '../../../data-layer/bookings/data-objects/BookingDO';
import { AddBookingItemsDO, BookingItemDO } from './AddBookingItemsDO';
import { ValidationResultParser } from '../../common/ValidationResultParser';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { BookingIntervalValidator } from '../validators/BookingIntervalValidator';
import { RoomDO } from '../../../data-layer/rooms/data-objects/RoomDO';
import { RoomSearchResultRepoDO } from '../../../data-layer/rooms/repositories/IRoomRepository';
import { PriceProductDO } from '../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductIdValidator } from '../../price-products/validators/PriceProductIdValidator';
import { PriceProductsContainer } from '../../price-products/validators/results/PriceProductsContainer';
import { BookingDOConstraints, BookingMeta } from '../../../data-layer/bookings/data-objects/BookingDOConstraints';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { CustomerIdValidator } from '../../customers/validators/CustomerIdValidator';
import { CustomerDO } from '../../../data-layer/customers/data-objects/CustomerDO';
import { CustomersContainer } from '../../customers/validators/results/CustomersContainer';
import { AllotmentIdValidator } from '../../allotments/validators/AllotmentIdValidator';
import { AllotmentsContainer } from '../../allotments/validators/results/AllotmentsContainer';
import { AllotmentDO } from '../../../data-layer/allotments/data-objects/AllotmentDO';
import { BookingItemsConverter, BookingItemsConverterParams } from './utils/BookingItemsConverter';
import { NewBookingsValidationRules } from './utils/NewBookingsValidationRules';
import { RoomCategoryStatsAggregator } from '../../room-categories/aggregators/RoomCategoryStatsAggregator';
import { RoomCategoryStatsDO } from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { BookingConfirmationEmailSender } from '../booking-confirmations/BookingConfirmationEmailSender';
import { BookingDataAggregatorQuery } from '../aggregators/BookingDataAggregator';
import { AddOnProductLoader, AddOnProductItemContainer } from '../../add-on-products/validators/AddOnProductLoader';
import { TaxResponseRepoDO } from '../../../data-layer/taxes/repositories/ITaxRepository';
import { TaxDO } from '../../../data-layer/taxes/data-objects/TaxDO';
import { ThUtils } from "../../../utils/ThUtils";
import { BookingSearchResultRepoDO, BookingMetaRepoDO, BookingSearchCriteriaRepoDO, BookingGroupMetaRepoDO } from "../../../data-layer/bookings/repositories/IBookingRepository";
import { PaymentMethodDO } from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';

export class AddBookingItems {
    private _addBookingItems: AddBookingItemsDO;
    private _inputChannel: GroupBookingInputChannel;

    private _loadedHotel: HotelDO;
    private _loadedPriceProductsContainer: PriceProductsContainer;
    private _loadedCustomersContainer: CustomersContainer;
    private _loadedAllotmentsContainer: AllotmentsContainer;
    private _loadedRoomList: RoomDO[];
    private _loadedRoomCategoryStatsList: RoomCategoryStatsDO[];
    private _loadedVatTaxList: TaxDO[];

    private _bookingList: BookingDO[];
    private _existingBookingList: BookingDO[];
    private _noOfRooms: number;

    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
        this._existingBookingList = [];
    }

    public add(addBookingItems: AddBookingItemsDO, inputChannel: GroupBookingInputChannel): Promise<BookingDO[]> {
        this._addBookingItems = addBookingItems;
        this._inputChannel = inputChannel;

        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            try {
                this.addCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.AddBookingItemsError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding bookings", this._addBookingItems, thError);
                reject(thError);
            }
        });
    }

    private addCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) {
        var validationResult = AddBookingItemsDO.getValidationStructure().validateStructure(this._addBookingItems);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._addBookingItems);
            parser.logAndReject("Error validating data add bookings", reject);
            return;
        }

        if (this._addBookingItems.bookingList.length == 0 || this._addBookingItems.bookingList.length > BookingDOConstraints.NoBookingsLimit) {
            var thError = new ThError(ThStatusCode.AddBookingItemsInvalidNoOfBookings, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid number of bookings", this._addBookingItems, thError);
            reject(thError);
            return;
        }

        this.getExistingBookingsIfTheGroupAlreadyExists().then((bookingList: BookingDO[]) => {
            this._existingBookingList = bookingList;
            // temporarilly add the existing bookings to the new booking items array
            // in order to validate the bookings as a whole (some per group constraints might be active)
            this.addExistingBookingItemsIfAnyToTheNewBookingItems();

            return this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id);
        }).then((loadedHotel: HotelDO) => {
            this._loadedHotel = loadedHotel;

            var intervalValidator = new BookingIntervalValidator(loadedHotel);
            var thDateIntervalDOList = this.getThDateIntervalDOListForBookings();
            return intervalValidator.validateBookingIntervalList({
                bookingIntervalList: thDateIntervalDOList,
                isNewBooking: true
            });
        }).then((validatedBookingIntervalList: ThDateIntervalDO[]) => {
            var priceProductValidator = new PriceProductIdValidator(this._appContext, this._sessionContext);
            var priceProductIdListToValidate = this.getPriceProductIdListForBookings();
            return priceProductValidator.validatePriceProductIdList(priceProductIdListToValidate);
        }).then((loadedPriceProductsContainer: PriceProductsContainer) => {
            this._loadedPriceProductsContainer = loadedPriceProductsContainer;

            var customerValidator = new CustomerIdValidator(this._appContext, this._sessionContext);
            var customerIdListToValidate = this.getCustomerIdListForBookings();
            return customerValidator.validateCustomerIdList(customerIdListToValidate);
        }).then((loadedCustomersContainer: CustomersContainer) => {
            this._loadedCustomersContainer = loadedCustomersContainer;

            var allotmentValidator = new AllotmentIdValidator(this._appContext, this._sessionContext);
            var allotmentIdListToValidate = this.getAllotmentIdListForBookings();
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

            var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
            return taxRepo.getTaxList({ hotelId: this._sessionContext.sessionDO.hotel.id });
        }).then((taxResponse: TaxResponseRepoDO) => {
            this._loadedVatTaxList = taxResponse.vatList;

            var addOnProductLoader = new AddOnProductLoader(this._appContext, this._sessionContext);
            return addOnProductLoader.load(this._loadedPriceProductsContainer.getAddOnProductIdList());
        }).then((addOnProductItemContainer: AddOnProductItemContainer) => {
            let bookingItemsConverterParams: BookingItemsConverterParams = {
                hotelDO: this._loadedHotel,
                currentHotelTimestamp: ThTimestampDO.buildThTimestampForTimezone(this._loadedHotel.timezone),
                priceProductsContainer: this._loadedPriceProductsContainer,
                customersContainer: this._loadedCustomersContainer,
                addOnProductItemContainer: addOnProductItemContainer,
                vatTaxList: this._loadedVatTaxList,
                roomCategoryStatsList: this._loadedRoomCategoryStatsList
            };
            if (!this.newBookingGroup) {
                bookingItemsConverterParams.groupBookingReference = this._existingBookingList[0].groupBookingReference;
            }
            var bookingItemsConverter = new BookingItemsConverter(this._appContext, this._sessionContext, bookingItemsConverterParams);

            return bookingItemsConverter.convert(this._addBookingItems.bookingList, this._inputChannel, this._addBookingItems.mergeInvoice);
        }).then((convertedBookingList: BookingDO[]) => {
            this._bookingList = convertedBookingList;
            this._noOfRooms = this._bookingList.length;

            let settingsRepo = this._appContext.getRepositoryFactory().getSettingsRepository();
            return settingsRepo.getPaymentMethods();
        }).then((allPaymentMethods: PaymentMethodDO[]) => {
            var newBookingValidationRules = new NewBookingsValidationRules(this._appContext, this._sessionContext, {
                hotel: this._loadedHotel,
                priceProductsContainer: this._loadedPriceProductsContainer,
                customersContainer: this._loadedCustomersContainer,
                allotmentsContainer: this._loadedAllotmentsContainer,
                roomList: this._loadedRoomList,
                roomCategoryStatsList: this._loadedRoomCategoryStatsList,
                allPaymentMethods: allPaymentMethods,
                enforceEnabledPaymentMethods: true
            });
            return newBookingValidationRules.validateBookingList(this._bookingList);
        }).then((validatedBookingList: BookingDO[]) => {
            var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();

            if (!this.newBookingGroup) {
                // the existing bookings were kept in the array in order to validate
                // the bookings as a whole
                this.removeExistingBookingsFromTheBookingListSentToServer();

                return bookingsRepo.addBookings(this._bookingMeta, this._bookingList, this._groupBookingMeta);
            }
            else {
                return bookingsRepo.addBookings(this._bookingMeta, this._bookingList);
            }
        }).then((createdBookingList: BookingDO[]) => {
            this._bookingList = createdBookingList;
            this.sendConfirmationAsync(createdBookingList);

            this._existingBookingList.forEach(b => { b.noOfRooms = this._noOfRooms });
            let bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
            return bookingsRepo.updateMultipleBookings(this._bookingMeta, this._existingBookingList);
        }).then((updatedBookingList: BookingDO[]) => {

            resolve(this._bookingList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.AddBookingItemsError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding bookings", this._addBookingItems, thError);
            }
            reject(thError);
        });
    }
    private getThDateIntervalDOListForBookings(): ThDateIntervalDO[] {
        return _.map(this._addBookingItems.bookingList, (bookingItem: BookingItemDO) => { return bookingItem.interval });
    }
    private getPriceProductIdListForBookings(): string[] {
        return _.map(this._addBookingItems.bookingList, (bookingItem: BookingItemDO) => { return bookingItem.priceProductId });
    }
    private getCustomerIdListForBookings(): string[] {
        var customerIdList: string[] = [];
        _.forEach(this._addBookingItems.bookingList, (bookingItem: BookingItemDO) => {
            customerIdList = customerIdList.concat(bookingItem.customerIdList);
        });
        return customerIdList;
    }
    private getAllotmentIdListForBookings(): string[] {
        var allotmentIdList: string[] = [];
        _.forEach(this._addBookingItems.bookingList, (bookingItem: BookingItemDO) => {
            if (_.isString(bookingItem.allotmentId) && bookingItem.allotmentId.length > 0) {
                allotmentIdList.push(bookingItem.allotmentId);
            }
        });
        return allotmentIdList;
    }
    private sendConfirmationAsync(groupBookingList: BookingDO[]) {
        var groupBookingId = groupBookingList[0].groupBookingId;
        var emailSender: BookingConfirmationEmailSender = new BookingConfirmationEmailSender(this._appContext, this._sessionContext);
        var bookingQuery: BookingDataAggregatorQuery = {
            groupBookingId: groupBookingId
        };
        return emailSender.sendBookingConfirmation(bookingQuery, this._addBookingItems.confirmationEmailList).then((emailResult: boolean) => { }).catch((err: any) => { });
    }

    private addExistingBookingItemsIfAnyToTheNewBookingItems() {
        let existingBookingItemList = [];

        _.forEach(this._existingBookingList, (bookingDO: BookingDO) => {
            existingBookingItemList.push(BookingItemDO.buildFromBookingDO(bookingDO));
        });
        this._addBookingItems.bookingList = existingBookingItemList.concat(this._addBookingItems.bookingList);
    }

    private get _groupBookingMeta(): BookingGroupMetaRepoDO {
        return {
            groupBookingId: this._existingBookingList[0].groupBookingId,
            groupBookingReference: this._existingBookingList[0].groupBookingReference
        }
    }

    private get newBookingGroup(): boolean {
        return this._thUtils.isUndefinedOrNull(this._addBookingItems.groupBookingId);
    }

    private getExistingBookingsIfTheGroupAlreadyExists(): Promise<BookingDO[]> {
        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            try {
                this.getExistingBookingsCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.AddBookingItemsErrorRetrievingExistingBookings, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error retrieving existing bookings", this._addBookingItems, thError);
                reject(thError);
            }
        });
    }

    private getExistingBookingsCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) {
        if (!this.newBookingGroup) {
            this._appContext.getRepositoryFactory().getBookingRepository().getBookingList(this._bookingMeta, this._groupBookingIdSearchCriteria)
                .then((result: BookingSearchResultRepoDO) => {
                    resolve(result.bookingList);
                }).catch((error) => {
                    reject(error);
                });
        }
        else {
            resolve([]);
        }
    }

    private removeExistingBookingsFromTheBookingListSentToServer() {
        this._bookingList.splice(0, this._existingBookingList.length);
    }

    private get _groupBookingIdSearchCriteria(): BookingSearchCriteriaRepoDO {
        return {
            groupBookingId: this._addBookingItems.groupBookingId
        };
    }

    private get _bookingMeta(): BookingMetaRepoDO {
        return {
            hotelId: this._sessionContext.sessionDO.hotel.id
        }
    }
}
