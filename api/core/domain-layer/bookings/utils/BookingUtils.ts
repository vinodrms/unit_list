import { ThUtils } from '../../../utils/ThUtils';
import { HotelDO } from '../../../data-layer/hotel/data-objects/HotelDO';
import { BookingDO, BookingConfirmationStatus } from '../../../data-layer/bookings/data-objects/BookingDO';
import { TriggerTimeParams } from '../../../data-layer/bookings/data-objects/state-change-time/BookingStateChangeTriggerTimeDO';
import { PriceProductDO } from '../../../data-layer/price-products/data-objects/PriceProductDO';
import { ThDateDO } from '../../../utils/th-dates/data-objects/ThDateDO';
import { ThHourDO } from '../../../utils/th-dates/data-objects/ThHourDO';
import { ThTimestampDO } from '../../../utils/th-dates/data-objects/ThTimestampDO';
import { CustomersContainer } from '../../customers/validators/results/CustomersContainer';
import { BookingPriceDO, BookingPriceType } from '../../../data-layer/bookings/data-objects/price/BookingPriceDO';
import { IndexedBookingInterval } from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import { InvoiceItemDO, InvoiceItemType } from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import { AddOnProductInvoiceItemMetaDO } from '../../../data-layer/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO';
import { AddOnProductSnapshotDO } from '../../../data-layer/add-on-products/data-objects/AddOnProductSnapshotDO';
import { AttachedAddOnProductItemDO } from '../../../data-layer/price-products/data-objects/included-items/AttachedAddOnProductItemDO';
import { IncludedBookingItems } from './IncludedBookingItems';
import { ConfigCapacityDO } from '../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { RoomCategoryStatsDO } from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';

import _ = require('underscore');

export class BookingUtils {
    private _thUtils: ThUtils;

    constructor() {
        this._thUtils = new ThUtils();
    }

    public getCurrentThDateForHotel(hotelDO: HotelDO): ThDateDO {
        var hotelTimestamp = this.getCurrentThTimestampForHotel(hotelDO);
        return hotelTimestamp.thDateDO;
    }
    public getCurrentThTimestampForHotel(hotelDO: HotelDO): ThTimestampDO {
        return ThTimestampDO.buildThTimestampForTimezone(hotelDO.timezone);
    }
    public updateIndexedSearchTerms(booking: BookingDO, customersContainer: CustomersContainer) {
        booking.indexedSearchTerms = [booking.groupBookingReference, booking.bookingReference];
        _.forEach(booking.customerIdList, (customerId: string) => {
            var customer = customersContainer.getCustomerById(customerId);
            if (!this._thUtils.isUndefinedOrNull(customer)) {
                booking.indexedSearchTerms.push(customer.customerDetails.getName());
            }
        });
    }
    public updateDisplayCustomerId(booking: BookingDO, customersContainer: CustomersContainer) {
        booking.displayCustomerId = booking.defaultBillingDetails.customerId;
        var customer = customersContainer.getCustomerById(booking.displayCustomerId);
        if (customer.isIndividual()) {
            return;
        }
        for (var custIndex = 0; custIndex < booking.customerIdList.length; custIndex++) {
            var currentCustomer = customersContainer.getCustomerById(booking.customerIdList[custIndex]);
            if (currentCustomer.isIndividual()) {
                booking.displayCustomerId = currentCustomer.id;
                return;
            }
        }
    }
    public updateBookingGuaranteedAndNoShowTimes(bookingDO: BookingDO, params: {
        priceProduct: PriceProductDO,
        hotel: HotelDO,
        currentHotelTimestamp: ThTimestampDO
    }) {
        var indexedBookingInterval = new IndexedBookingInterval(bookingDO.interval);
        bookingDO.guaranteedTime = params.priceProduct.conditions.policy.generateGuaranteedTriggerTime({ arrivalDate: indexedBookingInterval.getArrivalDate() });
        if (bookingDO.guaranteedTime.isInThePast({
            cancellationHour: params.hotel.operationHours.cancellationHour,
            currentHotelTimestamp: params.currentHotelTimestamp
        })) {
            bookingDO.confirmationStatus = BookingConfirmationStatus.Guaranteed;
        }
        bookingDO.noShowTime = params.priceProduct.conditions.policy.generateNoShowTriggerTime({ arrivalDate: indexedBookingInterval.getArrivalDate() });
    }
    public updateBookingPriceUsingRoomCategory(bookingDO: BookingDO, roomCategoryStatsList: RoomCategoryStatsDO[]) {
        var indexedBookingInterval = new IndexedBookingInterval(bookingDO.interval);

        var previousBookingVatId: string = null;
        if (!this._thUtils.isUndefinedOrNull(bookingDO.price) && !this._thUtils.isUndefinedOrNull(bookingDO.price.vatId) && _.isString(bookingDO.price.vatId)) {
            previousBookingVatId = bookingDO.price.vatId;
        }

        bookingDO.price = new BookingPriceDO();
        bookingDO.price.vatId = previousBookingVatId;

        bookingDO.price.movable = false;

        bookingDO.price.priceType = BookingPriceType.BookingStay;

        let pricePerNightList: number[] = bookingDO.priceProductSnapshot.price.getPricePerNightBreakdownFor({
            configCapacity: bookingDO.configCapacity,
            roomCategoryId: bookingDO.roomCategoryId,
            roomCategoryStatsList: roomCategoryStatsList,
            bookingInterval: indexedBookingInterval
        });

        // TODO: https://gitlab.3angletech.com/UnitPalDK/UnitPal/issues/139
        // For now we keep the mean average for every night, whereas we need to keep the exact prices for each night
        bookingDO.price.roomPricePerNightAvg = this._thUtils.getArrayAverage(pricePerNightList);
        bookingDO.price.roomPricePerNightAvg = this._thUtils.roundNumberToTwoDecimals(bookingDO.price.roomPricePerNightAvg);

        bookingDO.price.numberOfNights = indexedBookingInterval.getLengthOfStay();
        bookingDO.price.totalRoomPrice = this._thUtils.getArraySum(pricePerNightList);
        bookingDO.price.totalRoomPrice = this._thUtils.roundNumberToTwoDecimals(bookingDO.price.totalRoomPrice);
        var includedBookingItems = this.getIncludedInvoiceItems(bookingDO.priceProductSnapshot, bookingDO.configCapacity, indexedBookingInterval);
        bookingDO.price.totalOtherPrice = includedBookingItems.getTotalPrice();

        bookingDO.price.totalBookingPrice = bookingDO.price.totalRoomPrice + bookingDO.price.totalOtherPrice;
        bookingDO.price.totalBookingPrice = this._thUtils.roundNumberToTwoDecimals(bookingDO.price.totalBookingPrice);

        bookingDO.price.breakfast = includedBookingItems.breakfast;
        bookingDO.price.includedInvoiceItemList = includedBookingItems.includedInvoiceItemList;

        if (_.isArray(roomCategoryStatsList)) {
            var foundRoomCategoryStats: RoomCategoryStatsDO = _.find(roomCategoryStatsList, (stats: RoomCategoryStatsDO) => { return stats.roomCategory.id === bookingDO.roomCategoryId });
            if (!this._thUtils.isUndefinedOrNull(foundRoomCategoryStats)) {
                bookingDO.price.description = foundRoomCategoryStats.roomCategory.displayName;
            }
        }
    }
    public getIncludedInvoiceItems(priceProduct: PriceProductDO, configCapacity: ConfigCapacityDO, indexedBookingInterval: IndexedBookingInterval): IncludedBookingItems {
        var includedBookingItems = new IncludedBookingItems();
        if (priceProduct.includedItems.hasBreakfast()) {
            includedBookingItems.breakfast = this.convertAddOnProductSnapshotToInvoiceItem(
                priceProduct.includedItems.includedBreakfastAddOnProductSnapshot, indexedBookingInterval.getLengthOfStay()
            );
        }
        includedBookingItems.includedInvoiceItemList = [];
        _.forEach(priceProduct.includedItems.attachedAddOnProductItemList, (attachedAddOnProductItem: AttachedAddOnProductItemDO) => {
            var numberOfItems = attachedAddOnProductItem.getNumberOfItems({
                configCapacity: configCapacity,
                indexedBookingInterval: indexedBookingInterval
            });
            var invoiceItem = this.convertAddOnProductSnapshotToInvoiceItem(attachedAddOnProductItem.addOnProductSnapshot, numberOfItems);
            includedBookingItems.includedInvoiceItemList.push(invoiceItem);
        });
        return includedBookingItems;
    }
    private convertAddOnProductSnapshotToInvoiceItem(addOnProductSnapshot: AddOnProductSnapshotDO, numberOfItems: number): InvoiceItemDO {
        var invoiceItem = new InvoiceItemDO();
        invoiceItem.id = addOnProductSnapshot.id;
        invoiceItem.type = InvoiceItemType.AddOnProduct;
        var itemMeta = new AddOnProductInvoiceItemMetaDO();
        itemMeta.aopDisplayName = addOnProductSnapshot.name;
        itemMeta.numberOfItems = numberOfItems;
        itemMeta.pricePerItem = addOnProductSnapshot.price;
        if (_.isArray(addOnProductSnapshot.taxIdList) && addOnProductSnapshot.taxIdList.length > 0) {
            itemMeta.vatId = addOnProductSnapshot.taxIdList[0];
        }
        invoiceItem.meta = itemMeta;
        return invoiceItem;
    }

    public hasPenalty(booking: BookingDO, triggerParams: TriggerTimeParams): boolean {
        return booking.priceProductSnapshot.conditions.policy.hasCancellationPolicy() &&
            booking.guaranteedTime.isInThePast(triggerParams);
    }
}