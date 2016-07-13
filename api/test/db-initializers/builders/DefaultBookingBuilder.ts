import {ThError} from '../../../core/utils/th-responses/ThError';
import {TestContext} from '../../helpers/TestContext';
import {BookingDO, GroupBookingInputChannel, BookingConfirmationStatus} from '../../../core/data-layer/bookings/data-objects/BookingDO';
import {BookingPriceDO, BookingPriceType} from '../../../core/data-layer/bookings/data-objects/price/BookingPriceDO';
import {HotelDO} from '../../../core/data-layer/hotel/data-objects/HotelDO';
import {CustomerDO} from '../../../core/data-layer/customers/data-objects/CustomerDO';
import {RoomCategoryDO} from '../../../core/data-layer/room-categories/data-objects/RoomCategoryDO';
import {PriceProductDO} from '../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {ConfigCapacityDO} from '../../../core/data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {TestUtils} from '../../helpers/TestUtils';
import {ThDateUtils} from '../../../core/utils/th-dates/ThDateUtils';
import {DefaultBillingDetailsDO} from '../../../core/data-layer/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import {InvoicePaymentMethodType} from '../../../core/data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {ThDateIntervalDO} from '../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import {ThTimestampDO} from '../../../core/utils/th-dates/data-objects/ThTimestampDO';
import {AddBookingItemsDO, BookingItemDO} from '../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import {AddBookingItems} from '../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import {IndexedBookingInterval} from '../../../core/data-layer/price-products/utils/IndexedBookingInterval';
import {BookingUtils} from '../../../core/domain-layer/bookings/utils/BookingUtils';

export interface IBookingDataSource {
    getBookingList(hotelDO: HotelDO, customerList: CustomerDO[], roomCategoryList: RoomCategoryDO[], priceProductList: PriceProductDO[]): BookingDO[];
}

export class DefaultBookingBuilder implements IBookingDataSource {
    private _testUtils: TestUtils = new TestUtils();
    private _thDateUtils: ThDateUtils = new ThDateUtils();
    private _bookingUtils: BookingUtils;

    constructor(private _testContext: TestContext) {
        this._testUtils = new TestUtils();
        this._thDateUtils = new ThDateUtils();
        this._bookingUtils = new BookingUtils();
    }

    public getBookingList(hotelDO: HotelDO, customerList: CustomerDO[], roomCategoryList: RoomCategoryDO[], priceProductList: PriceProductDO[]): BookingDO[] {
        var bookingsList = [];
        bookingsList.push(this.buildBooking("2", hotelDO, customerList, roomCategoryList, priceProductList));
        bookingsList.push(this.buildBooking("3", hotelDO, customerList, roomCategoryList, priceProductList));
        return bookingsList;
    }

    private buildBooking(bookingId: string, hotelDO: HotelDO, customerList: CustomerDO[], roomCategoryList: RoomCategoryDO[], priceProductList: PriceProductDO[]): BookingDO {
        var priceProduct = priceProductList[0];
        var customerId = this._testUtils.getRandomListElement(customerList).id;
        var roomCategoryId = this._testUtils.getRandomListElement(priceProduct.roomCategoryIdList);
        var billingDetails = new DefaultBillingDetailsDO();
        billingDetails.buildFromObject({
            customerId: customerId,
            paymentGuarantee: true,
            paymentMethod: {
                type: InvoicePaymentMethodType.DefaultPaymentMethod,
                value: this._testUtils.getRandomListElement(hotelDO.paymentMethodIdList)
            }
        });
        var booking = new BookingDO();
        booking.groupBookingId = "1";
        booking.groupBookingReference = "ref1";
        booking.inputChannel = GroupBookingInputChannel.PropertyManagementSystem;
        booking.noOfRooms = 1;

        booking.bookingId = bookingId;
        booking.bookingReference = "ref2";
        booking.confirmationStatus = BookingConfirmationStatus.Confirmed;
        booking.customerIdList = [customerId];
        booking.defaultBillingDetails = billingDetails;
        booking.interval = this.generateRandomFutureInterval(hotelDO);
        booking.configCapacity = this.getConfigCapacity();
        booking.roomCategoryId = roomCategoryId;
        booking.priceProductId = priceProduct.id;
        booking.priceProductSnapshot = priceProduct;
        var indexedBookingInterval = new IndexedBookingInterval(booking.interval);
        booking.startUtcTimestamp = indexedBookingInterval.getStartUtcTimestamp();
        booking.endUtcTimestamp = indexedBookingInterval.getEndUtcTimestamp();
        var currentHotelDate = this._bookingUtils.getCurrentThDateForHotel(hotelDO);
        booking.guaranteedTime = priceProduct.conditions.policy.generateGuaranteedTriggerTime({ arrivalDate: indexedBookingInterval.getArrivalDate() });
        if (booking.guaranteedTime.isInThePast({
            cancellationHour: hotelDO.operationHours.cancellationHour,
            currentHotelTimestamp: ThTimestampDO.buildThTimestampForTimezone(hotelDO.timezone)
        })) {
            booking.confirmationStatus = BookingConfirmationStatus.Guaranteed;
        }

        booking.noShowTime = priceProduct.conditions.policy.generateNoShowTriggerTime({ arrivalDate: indexedBookingInterval.getArrivalDate() });

        booking.fileAttachmentList = [];
        booking.notes = "This is an automatic booking";

        booking.price = new BookingPriceDO();
        booking.price.priceType = BookingPriceType.BookingStay;
        booking.price.numberOfItems = indexedBookingInterval.getLengthOfStay();
        booking.price.pricePerItem = priceProduct.price.getPricePerNightFor({
            configCapacity: booking.configCapacity,
            roomCategoryId: booking.roomCategoryId
        });
        booking.price.totalPrice = booking.price.numberOfItems * booking.price.pricePerItem;

        return booking;
    }

    private getConfigCapacity(): ConfigCapacityDO {
        var capacity = new ConfigCapacityDO();
        capacity.noAdults = 1;
        capacity.noChildren = 0;
        capacity.noBabies = 0;
        return capacity;
    }

    private generateRandomFutureInterval(hotelDO: HotelDO): ThDateIntervalDO {
        var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(hotelDO.timezone);
        var startDate = this._thDateUtils.addDaysToThDateDO(thTimestamp.thDateDO, this._testUtils.getRandomIntBetween(10, 200));
        var endDate = this._thDateUtils.addDaysToThDateDO(startDate.buildPrototype(), this._testUtils.getRandomIntBetween(1, 7));
        return ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
    }

    public loadBookings(dataSource: IBookingDataSource, hotelDO: HotelDO, customerList: CustomerDO[], roomCategoryList: RoomCategoryDO[], priceProductList: PriceProductDO[]): Promise<BookingDO[]> {
        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            this.loadBookingsCore(resolve, reject, dataSource, hotelDO, customerList, roomCategoryList, priceProductList);
        });
    }
    private loadBookingsCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void },
        dataSource: IBookingDataSource, hotelDO: HotelDO, customerList: CustomerDO[], roomCategoryList: RoomCategoryDO[], priceProductList: PriceProductDO[]) {
        var bookingsRepo = this._testContext.appContext.getRepositoryFactory().getBookingRepository();
        bookingsRepo.addBookings({ hotelId: hotelDO.id }, dataSource.getBookingList(hotelDO, customerList, roomCategoryList, priceProductList)).then((bookingList: BookingDO[]) => {
            resolve(bookingList);
        }).catch((error: any) => {
            reject(error);
        });
    }
}