import { ThError } from '../../../core/utils/th-responses/ThError';
import { TestContext } from '../../helpers/TestContext';
import { BookingDO, GroupBookingInputChannel, BookingConfirmationStatus, BookingStatus, TravelActivityType, TravelType, AddOnProductBookingReservedItem } from '../../../core/data-layer/bookings/data-objects/BookingDO';
import { BookingPriceDO, BookingPriceType } from '../../../core/data-layer/bookings/data-objects/price/BookingPriceDO';
import { HotelDO } from '../../../core/data-layer/hotel/data-objects/HotelDO';
import { CustomerDO } from '../../../core/data-layer/customers/data-objects/CustomerDO';
import { RoomCategoryStatsDO } from '../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { PriceProductDO } from '../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { ConfigCapacityDO } from '../../../core/data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { TestUtils } from '../../helpers/TestUtils';
import { ThDateUtils } from '../../../core/utils/th-dates/ThDateUtils';
import { DefaultBillingDetailsDO } from '../../../core/data-layer/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import { InvoicePaymentMethodType } from '../../../core/data-layer/invoices-deprecated/data-objects/payers/InvoicePaymentMethodDO';
import { ThDateIntervalDO } from '../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import { ThTimestampDO } from '../../../core/utils/th-dates/data-objects/ThTimestampDO';
import { AddBookingItemsDO, BookingItemDO } from '../../../core/domain-layer/bookings/add-bookings/AddBookingItemsDO';
import { AddBookingItems } from '../../../core/domain-layer/bookings/add-bookings/AddBookingItems';
import { IndexedBookingInterval } from '../../../core/data-layer/price-products/utils/IndexedBookingInterval';
import { BookingUtils } from '../../../core/domain-layer/bookings/utils/BookingUtils';
import { PaymentMethodInstanceDO } from "../../../core/data-layer/common/data-objects/payment-method/PaymentMethodInstanceDO";
import { AddOnProductDO } from "../../../core/data-layer/add-on-products/data-objects/AddOnProductDO";

import _ = require("underscore");

export interface IBookingDataSource {
    getBookingList(hotelDO: HotelDO, customerList: CustomerDO[], roomCategoryStatsList: RoomCategoryStatsDO[],
        priceProductList: PriceProductDO[], addOnProductList: AddOnProductDO[]): BookingDO[];
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

    public getBookingList(hotelDO: HotelDO, customerList: CustomerDO[], roomCategoryStatsList: RoomCategoryStatsDO[],
        priceProductList: PriceProductDO[], addOnProductList: AddOnProductDO[]): BookingDO[] {
        var bookingsList = [];

        let reservedAddOnProductIdList: AddOnProductBookingReservedItem[] = _.map(addOnProductList, aop => {
            var item = new AddOnProductBookingReservedItem();
            item.aopId = aop.id;
            item.noOfItems = 1;
            return item;
        });
        bookingsList.push(this.buildBooking("1", "groupRef1", "ref1", hotelDO, customerList, roomCategoryStatsList, priceProductList, reservedAddOnProductIdList));

        bookingsList.push(this.buildBooking("1", "groupRef1", "ref2", hotelDO, customerList, roomCategoryStatsList, priceProductList, []));
        bookingsList.push(this.buildBooking("2", "groupRef2", "ref3", hotelDO, customerList, roomCategoryStatsList, priceProductList, []));

        return bookingsList;
    }

    private buildBooking(groupBookingId: string, groupBookingRef: string, bookingRef: string, hotelDO: HotelDO, customerList: CustomerDO[],
        roomCategoryStatsList: RoomCategoryStatsDO[], priceProductList: PriceProductDO[], reservedAddOnProductList: AddOnProductBookingReservedItem[]): BookingDO {
        var priceProduct = priceProductList[0];
        var customerId = this._testUtils.getRandomListElement(customerList).id;
        var roomCategoryId = this._testUtils.getRandomListElement(priceProduct.roomCategoryIdList);
        var billingDetails = new DefaultBillingDetailsDO();
        billingDetails.buildFromObject({
            customerId: customerId,
            paymentGuarantee: true,
            paymentMethod: {
                type: InvoicePaymentMethodType.DefaultPaymentMethod,
                value: this._testUtils.getRandomListElement(hotelDO.paymentMethodList).paymentMethodId
            }
        });
        var booking = new BookingDO();
        booking.status = BookingStatus.Active;
        booking.groupBookingId = groupBookingId;
        booking.groupBookingReference = groupBookingRef;
        booking.inputChannel = GroupBookingInputChannel.PropertyManagementSystem;
        booking.noOfRooms = 1;
        booking.bookingReference = bookingRef;
        booking.confirmationStatus = BookingConfirmationStatus.Confirmed;
        booking.customerIdList = [customerId];
        booking.displayCustomerId = customerId;
        booking.defaultBillingDetails = billingDetails;
        booking.interval = this.generateRandomFutureInterval(hotelDO);
        booking.configCapacity = this.getConfigCapacity();
        booking.roomCategoryId = roomCategoryId;
        booking.priceProductId = priceProduct.id;
        booking.priceProductSnapshot = priceProduct;
        booking.reservedAddOnProductList = reservedAddOnProductList;
        var indexedBookingInterval = new IndexedBookingInterval(booking.interval);
        booking.creationDate = ThTimestampDO.buildThTimestampForTimezone(hotelDO.timezone).thDateDO;
        booking.creationDateUtcTimestamp = booking.creationDate.getUtcTimestamp();
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
        booking.travelActivityType = TravelActivityType.Leisure;
        booking.travelType = TravelType.Individual;

        let billedCustomer = _.find(customerList, customer => { return customer.id === customerId });
        this._bookingUtils.updateBookingPriceUsingRoomCategoryAndSavePPSnapshot(booking, roomCategoryStatsList, priceProduct, billedCustomer);

        return booking;
    }

    private getConfigCapacity(): ConfigCapacityDO {
        var capacity = new ConfigCapacityDO();
        capacity.noAdults = 1;
        capacity.noChildren = 0;
        capacity.noBabies = 0;
        capacity.noBabyBeds = 0;
        return capacity;
    }

    private generateRandomFutureInterval(hotelDO: HotelDO): ThDateIntervalDO {
        var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(hotelDO.timezone);
        var startDate = this._thDateUtils.addDaysToThDateDO(thTimestamp.thDateDO, this._testUtils.getRandomIntBetween(10, 200));
        var endDate = this._thDateUtils.addDaysToThDateDO(startDate.buildPrototype(), this._testUtils.getRandomIntBetween(1, 7));
        return ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
    }

    public loadBookings(dataSource: IBookingDataSource, hotelDO: HotelDO, customerList: CustomerDO[], roomCategoryStatsList: RoomCategoryStatsDO[],
        priceProductList: PriceProductDO[], addOnProductList: AddOnProductDO[]): Promise<BookingDO[]> {
        return new Promise<BookingDO[]>((resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void }) => {
            this.loadBookingsCore(resolve, reject, dataSource, hotelDO, customerList, roomCategoryStatsList, priceProductList, addOnProductList);
        });
    }
    private loadBookingsCore(resolve: { (result: BookingDO[]): void }, reject: { (err: ThError): void },
        dataSource: IBookingDataSource, hotelDO: HotelDO, customerList: CustomerDO[],
        roomCategoryStatsList: RoomCategoryStatsDO[], priceProductList: PriceProductDO[], addOnProductList: AddOnProductDO[]) {
        var bookingsRepo = this._testContext.appContext.getRepositoryFactory().getBookingRepository();

        var bookingList = dataSource.getBookingList(hotelDO, customerList, roomCategoryStatsList, priceProductList, addOnProductList);
        var groupedBookingsByGroupBookingRef = _.groupBy(bookingList, (booking: BookingDO) => {
            return booking.groupBookingReference;
        });
        var addBookingGroupPromiseList = [];
        for (var groupBookingRef in groupedBookingsByGroupBookingRef) {
            addBookingGroupPromiseList.push(bookingsRepo.addBookings({ hotelId: hotelDO.id }, groupedBookingsByGroupBookingRef[groupBookingRef]));
        }

        Promise.all(addBookingGroupPromiseList).then((result: BookingDO[][]) => {
            resolve(_.flatten(result));
        }).catch((error: any) => {
            reject(error);
        });

        bookingsRepo.addBookings({ hotelId: hotelDO.id }, dataSource.getBookingList(hotelDO, customerList, roomCategoryStatsList, priceProductList, addOnProductList)).then((bookingList: BookingDO[]) => {
            resolve(bookingList);
        });
    }
}
