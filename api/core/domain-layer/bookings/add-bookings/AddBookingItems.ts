import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {GroupBookingInputChannel, BookingDO} from '../../../data-layer/bookings/data-objects/BookingDO';
import {AddBookingItemsDO, BookingItemDO} from './AddBookingItemsDO';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {BookingIntervalValidator} from '../validators/BookingIntervalValidator';
import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductIdValidator} from '../../price-products/validators/PriceProductIdValidator';
import {PriceProductsContainer} from '../../price-products/validators/results/PriceProductsContainer';
import {BookingDOConstraints} from '../../../data-layer/bookings/data-objects/BookingDOConstraints';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {CustomerIdValidator} from '../../customers/validators/CustomerIdValidator';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {CustomersContainer} from '../../customers/validators/results/CustomersContainer';
import {AllotmentIdValidator} from '../../allotments/validators/AllotmentIdValidator';
import {AllotmentsContainer} from '../../allotments/validators/results/AllotmentsContainer';
import {AllotmentDO} from '../../../data-layer/allotments/data-objects/AllotmentDO';
import {BookingItemsConverter, BookingItemsConverterParams} from './utils/BookingItemsConverter';
import {NewBookingsValidationRules} from './utils/NewBookingsValidationRules';

import _ = require('underscore');

export class AddBookingItems {
    private _bookingItems: AddBookingItemsDO;
    private _inputChannel: GroupBookingInputChannel;

    private _loadedHotel: HotelDO;
    private _loadedPriceProductsContainer: PriceProductsContainer;
    private _loadedCustomersContainer: CustomersContainer;
    private _loadedAllotmentsContainer: AllotmentsContainer;

    private _bookingList: BookingDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public add(bookingItems: AddBookingItemsDO, inputChannel: GroupBookingInputChannel): Promise<BookingDO[]> {
        this._bookingItems = bookingItems;
        this._inputChannel = inputChannel;

        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            try {
                this.addCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.AddBookingItemsError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding bookings", this._bookingItems, thError);
                reject(thError);
            }
        });
    }

    private addCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) {
        var validationResult = AddBookingItemsDO.getValidationStructure().validateStructure(this._bookingItems);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._bookingItems);
            parser.logAndReject("Error validating data add bookings", reject);
            return;
        }
        if (this._bookingItems.bookingList.length == 0 || this._bookingItems.bookingList.length > BookingDOConstraints.NoBookingsLimit) {
            var thError = new ThError(ThStatusCode.AddBookingItemsInvalidNoOfBookings, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid number of bookings", this._bookingItems, thError);
            reject(thError);
            return;
        }
        this._appContext.getRepositoryFactory().getHotelRepository().getHotelById(this._sessionContext.sessionDO.hotel.id)
            .then((loadedHotel: HotelDO) => {
                this._loadedHotel = loadedHotel;

                var intervalValidator = new BookingIntervalValidator(loadedHotel);
                return intervalValidator.validateBookingInterval(this._bookingItems.interval);
            }).then((validatedBookingInterval: ThDateIntervalDO) => {
                this._bookingItems.interval = validatedBookingInterval;

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
                return allotmentValidator.validateAllotmentIdList(allotmentIdListToValidate);
            }).then((loadedAllotmentsContainer: AllotmentsContainer) => {
                this._loadedAllotmentsContainer = loadedAllotmentsContainer;

                var bookingItemsConverter = new BookingItemsConverter(this._appContext, this._sessionContext, {
                    hotelDO: this._loadedHotel,
                    priceProductsContainer: this._loadedPriceProductsContainer
                });
                return bookingItemsConverter.convert(this._bookingItems, this._inputChannel);
            }).then((convertedBookingList: BookingDO[]) => {
                this._bookingList = convertedBookingList;

                var newBookingValidationRules = new NewBookingsValidationRules(this._appContext, this._sessionContext, {
                    hotel: this._loadedHotel,
                    priceProductsContainer: this._loadedPriceProductsContainer,
                    customersContainer: this._loadedCustomersContainer,
                    allotmentsContainer: this._loadedAllotmentsContainer
                });
                return newBookingValidationRules.validateBookingList(this._bookingList);
            }).then((validatedBookingList: BookingDO[]) => {
                var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
                return bookingsRepo.addBookings({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._bookingList);
            }).then((createdBookingList: BookingDO[]) => {
                this._bookingList = createdBookingList;
                resolve(this._bookingList);
                // TODO: send email & generate invoices for bookings with cancel < currentTimestamp
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.AddBookingItemsError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error adding bookings", this._bookingItems, thError);
                }
                reject(thError);
            });
    }
    private getPriceProductIdListForBookings(): string[] {
        return _.map(this._bookingItems.bookingList, (bookingItem: BookingItemDO) => { return bookingItem.priceProductId });
    }
    private getCustomerIdListForBookings(): string[] {
        var customerIdList: string[] = [];
        _.forEach(this._bookingItems.bookingList, (bookingItem: BookingItemDO) => {
            customerIdList = customerIdList.concat(bookingItem.customerIdList);
        });
        return customerIdList;
    }
    private getAllotmentIdListForBookings(): string[] {
        var allotmentIdList: string[] = [];
        _.forEach(this._bookingItems.bookingList, (bookingItem: BookingItemDO) => {
            if (_.isString(bookingItem.allotmentId) && bookingItem.allotmentId.length > 0) {
                allotmentIdList.push(bookingItem.allotmentId);
            }
        });
        return allotmentIdList;
    }
}