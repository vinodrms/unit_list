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
import { PricePerDayDO } from '../../../data-layer/bookings/data-objects/price/PricePerDayDO';
import { IndexedBookingInterval } from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import { InvoiceItemDO, InvoiceItemType } from '../../../data-layer/invoices-deprecated/data-objects/items/InvoiceItemDO';
import { AddOnProductInvoiceItemMetaDO } from '../../../data-layer/invoices-deprecated/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO';
import { AddOnProductSnapshotDO } from '../../../data-layer/add-on-products/data-objects/AddOnProductSnapshotDO';
import { AttachedAddOnProductItemDO } from '../../../data-layer/price-products/data-objects/included-items/AttachedAddOnProductItemDO';
import { IncludedBookingItems } from './IncludedBookingItems';
import { ConfigCapacityDO } from '../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { RoomCategoryStatsDO } from '../../../data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { StringOccurenciesIndexer } from "../../../utils/indexers/StringOccurenciesIndexer";
import { CustomerDO } from "../../../data-layer/customers/data-objects/CustomerDO";
import { CommissionDO } from "../../../data-layer/common/data-objects/commission/CommissionDO";

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
        // when changing the order in which the terms are saved, be sure to also check the logic from the `getIndexedCustomerNames` function on BookingDO
        booking.indexedSearchTerms = [booking.groupBookingReference, booking.groupBookingReference + '/' + booking.bookingReference];
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
    public updateCorporateDisplayCustomerId(booking: BookingDO, customersContainer: CustomersContainer) {
        booking.corporateDisplayCustomerId = "";
        for (var custIndex = 0; custIndex < booking.customerIdList.length; custIndex++) {
            var currentCustomer = customersContainer.getCustomerById(booking.customerIdList[custIndex]);
            if (currentCustomer.isCompanyOrTravelAgency()) {
                booking.corporateDisplayCustomerId = currentCustomer.id;
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

    /**
     * Function used to update the price on a booking using its attached Price Product
     *
     * `bookingDO`: the booking on which the price will be recomputed
     * `roomCategoryStatsList`: the list of room category stats of the hotel; are needed because some prices depend on the room's configuration
     * `groupBookingRoomCategoryIdList`: the list of room category ids that are inside the same group booking; it needs to be passed only when the bookings are initially added to apply the min no rooms discount constraints if they exist
    */
    public updateBookingPriceUsingRoomCategoryAndSavePPSnapshot(bookingDO: BookingDO, roomCategoryStatsList: RoomCategoryStatsDO[],
        priceProduct: PriceProductDO, billingCustomer: CustomerDO, groupBookingRoomCategoryIdList?: string[]) {
        var indexedBookingInterval = new IndexedBookingInterval(bookingDO.interval);

        // update the snapshot of the price product applied on the booking
        bookingDO.priceProductSnapshot = new PriceProductDO();
        bookingDO.priceProductSnapshot.buildFromObject(priceProduct);

        var previousBookingVatId: string = null;
        if (!this._thUtils.isUndefinedOrNull(bookingDO.price) && !this._thUtils.isUndefinedOrNull(bookingDO.price.vatId) && _.isString(bookingDO.price.vatId)) {
            previousBookingVatId = bookingDO.price.vatId;
        }

        bookingDO.price = new BookingPriceDO();
        bookingDO.price.vatId = previousBookingVatId;

        bookingDO.price.priceType = BookingPriceType.BookingStay;

        // get the breakdown of prices per night
        let pricePerDayList: PricePerDayDO[] = bookingDO.priceProductSnapshot.price.getPricePerDayBreakdownFor({
            configCapacity: bookingDO.configCapacity,
            roomCategoryId: bookingDO.roomCategoryId,
            roomCategoryStatsList: roomCategoryStatsList,
            bookingInterval: indexedBookingInterval
        });

        var groupBookingRoomCategoryIdIndexer: StringOccurenciesIndexer;
        if (!this._thUtils.isUndefinedOrNull(groupBookingRoomCategoryIdList)) {
            groupBookingRoomCategoryIdIndexer = new StringOccurenciesIndexer(groupBookingRoomCategoryIdList);
        }
        let discountPerDayBreakdown = bookingDO.priceProductSnapshot.discounts.getDiscountValuesBreakdownFor({
            indexedBookingInterval: indexedBookingInterval,
            bookingCreationDate: bookingDO.creationDate,
            configCapacity: bookingDO.configCapacity,

            indexedNumberOfRoomCategoriesFromGroupBooking: groupBookingRoomCategoryIdIndexer,
            roomCategoryIdListFromPriceProduct: bookingDO.priceProductSnapshot.roomCategoryIdList,
            bookingBilledCustomerId: bookingDO.defaultBillingDetails.customerId
        });
        pricePerDayList = this.getPricePerDayListWithDiscount(pricePerDayList, discountPerDayBreakdown);

        bookingDO.price.roomPricePerNightList = pricePerDayList;
        bookingDO.price.roomPricePerNightAvg = this._thUtils.getArrayAverage(pricePerDayList);
        bookingDO.price.roomPricePerNightAvg = this._thUtils.roundNumberToTwoDecimals(bookingDO.price.roomPricePerNightAvg);

        bookingDO.price.numberOfNights = indexedBookingInterval.getLengthOfStay();
        bookingDO.price.totalRoomPrice = this._thUtils.getArraySum(pricePerDayList);
        bookingDO.price.totalRoomPrice = this._thUtils.roundNumberToTwoDecimals(bookingDO.price.totalRoomPrice);

        let commission: CommissionDO = billingCustomer.customerDetails.getCommission();
        bookingDO.price.deductedCommissionPrice = commission.getCommissionFor(bookingDO.price.totalRoomPrice);
        bookingDO.price.commissionSnapshot = commission;

        var includedBookingItems = this.getIncludedInvoiceItems(bookingDO.priceProductSnapshot, bookingDO.configCapacity, indexedBookingInterval);
        bookingDO.price.totalOtherPrice = includedBookingItems.getTotalPrice();

        bookingDO.price.totalBookingPrice = bookingDO.price.totalRoomPrice - bookingDO.price.deductedCommissionPrice + bookingDO.price.totalOtherPrice;
        bookingDO.price.totalBookingPrice = this._thUtils.roundNumberToTwoDecimals(bookingDO.price.totalBookingPrice);

        bookingDO.price.breakfast = includedBookingItems.breakfast;
        bookingDO.price.includedInvoiceItemList = includedBookingItems.includedInvoiceItemList;

        if (_.isArray(roomCategoryStatsList)) {
            var foundRoomCategoryStats: RoomCategoryStatsDO = _.find(roomCategoryStatsList, (stats: RoomCategoryStatsDO) => { return stats.roomCategory.id === bookingDO.roomCategoryId });
            if (!this._thUtils.isUndefinedOrNull(foundRoomCategoryStats)) {
                bookingDO.price.description = foundRoomCategoryStats.roomCategory.displayName;
            }
        }

        // cleanup the unnecessary attributes on the PP snapshot saved on the booking - to keep the document's size relatively small
        bookingDO.priceProductSnapshot.openForArrivalIntervalList = [];
        bookingDO.priceProductSnapshot.openForDepartureIntervalList = [];
        bookingDO.priceProductSnapshot.openIntervalList = [];
        bookingDO.priceProductSnapshot.price.enabledDynamicPriceIdByDate = {};
    }
    public getPricePerDayListWithDiscount(pricePerDayList: PricePerDayDO[], discountPerDayBreakdown: number[]): PricePerDayDO[] {
        return _.map(pricePerDayList, (pricePerDay, index) => {
            if (discountPerDayBreakdown[index] > 0.0) {
                pricePerDay.price = (1 - discountPerDayBreakdown[index]) * pricePerDay.price;
            }
            pricePerDay.price = this._thUtils.roundNumberToTwoDecimals(pricePerDay.price);
            pricePerDay.discount = discountPerDayBreakdown[index];
            return pricePerDay;
        });
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
        itemMeta.includedInBooking = true;

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
