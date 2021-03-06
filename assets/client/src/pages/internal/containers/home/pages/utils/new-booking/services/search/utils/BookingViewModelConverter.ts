import * as _ from "underscore";
import { ThTranslation } from '../../../../../../../../../../common/utils/localization/ThTranslation';
import { ThUtils } from '../../../../../../../../../../common/utils/ThUtils';
import { CurrencyDO } from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import { ConfigCapacityDO } from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import { ThDateIntervalDO } from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import { BookingSearchResultDO } from '../data-objects/BookingSearchResultDO';
import { BookingCartItemVM, BookingCartItemVMType } from '../view-models/BookingCartItemVM';
import { RoomCategoryItemDO } from '../data-objects/room-category-item/RoomCategoryItemDO';
import { AllotmentItemDO } from '../data-objects/allotment-item/AllotmentItemDO';
import { PriceProductItemDO } from '../data-objects/price-product-item/PriceProductItemDO';
import { TransientBookingItem } from '../../data-objects/TransientBookingItem';
import { BookingSearchParams } from '../../data-objects/BookingSearchParams';
import { DefaultBillingDetailsDO } from '../../../../../../../../services/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import { CustomerDO } from '../../../../../../../../services/customers/data-objects/CustomerDO';
import { InvoicePaymentMethodDO, InvoicePaymentMethodType } from '../../../../../../../../services/invoices/data-objects/payer/InvoicePaymentMethodDO';
import { HotelAggregatedInfo } from '../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import { BookingVM } from "../../../../../../../../services/bookings/view-models/BookingVM";

export class BookingViewModelConverter {
    private _thUtils: ThUtils;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
    }

    public convertSearchResultToVMList(bookingSearchResultDO: BookingSearchResultDO, bookingSearchParams: BookingSearchParams, hotelAggregatedInfo: HotelAggregatedInfo): BookingCartItemVM[] {
        var bookingItemVMList: BookingCartItemVM[] = [];
        _.forEach(bookingSearchResultDO.roomCategoryItemList, (roomCategoryItem: RoomCategoryItemDO) => {
            bookingItemVMList = bookingItemVMList.concat(this.getBookingSearchResultForRoom(roomCategoryItem, bookingSearchResultDO, bookingSearchParams, hotelAggregatedInfo));
        });
        return bookingItemVMList;
    }

    private getBookingSearchResultForRoom(roomCategoryItem: RoomCategoryItemDO, bookingSearchResultDO: BookingSearchResultDO,
        bookingSearchParams: BookingSearchParams, hotelAggregatedInfo: HotelAggregatedInfo): BookingCartItemVM[] {

        if (!roomCategoryItem.canFit) {
            return [];
        }

        var bookingItemVMList: BookingCartItemVM[] = [];

        var addedPriceProductIdByRoomCateg: { [index: string]: string; } = {};

        var allotmentItemDOList: AllotmentItemDO[] = bookingSearchResultDO.getAllotmentsFilteredByRoomCategory(roomCategoryItem.stats.roomCategory.id);
        _.forEach(allotmentItemDOList, (allotmentItem: AllotmentItemDO) => {
            if (allotmentItem.noOccupiedAllotments < allotmentItem.noTotalAllotments) {
                var priceProductItem = bookingSearchResultDO.getPriceProductItemById(allotmentItem.priceProductId);
                if (priceProductItem) {
                    bookingItemVMList.push(this.createBookingItemVM(bookingSearchResultDO, bookingSearchParams, roomCategoryItem, priceProductItem, hotelAggregatedInfo, allotmentItem));
                    addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id] = roomCategoryItem.stats.roomCategory.id;
                }
            }
        });
        var priceProductItemList: PriceProductItemDO[] = bookingSearchResultDO.getPriceProductsFilteredByIds(roomCategoryItem.priceProductIdList);
        _.forEach(priceProductItemList, (priceProductItem: PriceProductItemDO) => {
            if (!addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id]
                || addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id] != roomCategoryItem.stats.roomCategory.id) {
                bookingItemVMList.push(this.createBookingItemVM(bookingSearchResultDO, bookingSearchParams, roomCategoryItem, priceProductItem, hotelAggregatedInfo));
                addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id] = roomCategoryItem.stats.roomCategory.id;
            }
        });

        return bookingItemVMList;
    }

    private createBookingItemVM(bookingSearchResultDO: BookingSearchResultDO, bookingSearchParams: BookingSearchParams,
        roomCategoryItem: RoomCategoryItemDO, priceProductItem: PriceProductItemDO,
        hotelAggregatedInfo: HotelAggregatedInfo, allotmentItem?: AllotmentItemDO): BookingCartItemVM {

        var bookingItemVM = new BookingCartItemVM();
        bookingItemVM.transientBookingItem = new TransientBookingItem()

        bookingItemVM.itemType = BookingCartItemVMType.NormalBooking;
        bookingItemVM.uniqueId = priceProductItem.priceProduct.id + roomCategoryItem.stats.roomCategory.id;
        bookingItemVM.priceProductName = priceProductItem.priceProduct.name;
        bookingItemVM.roomCategoryName = roomCategoryItem.stats.roomCategory.displayName;
        bookingItemVM.roomCapacity = roomCategoryItem.stats.capacity.totalCapacity;
        bookingItemVM.noAvailableRooms = roomCategoryItem.stats.noOfRooms - roomCategoryItem.noOccupiedRooms;
        if (!allotmentItem) {
            bookingItemVM.noAvailableAllotmentsString = "n/a";
            bookingItemVM.noAvailableAllotments = 0;
        }
        else {
            bookingItemVM.noAvailableAllotments = allotmentItem.noTotalAllotments - allotmentItem.noOccupiedAllotments;
            bookingItemVM.noAvailableAllotmentsString = bookingItemVM.noAvailableAllotments + "";
            bookingItemVM.transientBookingItem.allotmentId = allotmentItem.allotment.id;
        }
        var priceProductItemPrice = priceProductItem.getPriceForRoomCategory(roomCategoryItem.stats.roomCategory.id);
        bookingItemVM.totalPrice = (priceProductItemPrice) ? priceProductItemPrice.price : 0.0;
        bookingItemVM.totalPriceString = bookingItemVM.totalPrice + hotelAggregatedInfo.ccy.nativeSymbol;
        bookingItemVM.commision = (priceProductItemPrice) ? priceProductItemPrice.commision : 0.0;
        bookingItemVM.commisionString = bookingItemVM.commision + hotelAggregatedInfo.ccy.nativeSymbol;
        bookingItemVM.otherPrice = (priceProductItemPrice) ? priceProductItemPrice.otherPrice : 0.0;
        bookingItemVM.otherPriceString = bookingItemVM.otherPrice + hotelAggregatedInfo.ccy.nativeSymbol;
        bookingItemVM.pricePerDayList = (priceProductItemPrice) ? priceProductItemPrice.pricePerDayList : [];
        bookingItemVM.conditionsString = priceProductItem.priceProduct.conditions.getCancellationConditionsString(this._thTranslation);
        bookingItemVM.constraintsString = priceProductItem.priceProduct.constraints.getBriefValueDisplayString(this._thTranslation);

        bookingItemVM.bookingCapacity = new ConfigCapacityDO();
        bookingItemVM.bookingCapacity.buildFromObject(bookingSearchParams.configCapacity);

        bookingItemVM.transientBookingItem.configCapacity = bookingItemVM.bookingCapacity;
        bookingItemVM.transientBookingItem.interval = new ThDateIntervalDO();
        bookingItemVM.transientBookingItem.interval.buildFromObject(bookingSearchParams.interval);
        bookingItemVM.transientBookingItem.notes = "";
        bookingItemVM.bookingInterval = bookingItemVM.transientBookingItem.interval;

        bookingItemVM.transientBookingItem.roomCategoryId = roomCategoryItem.stats.roomCategory.id;
        bookingItemVM.transientBookingItem.priceProductId = priceProductItem.priceProduct.id;

        bookingItemVM.priceProduct = priceProductItem.priceProduct;
        bookingItemVM.ccy = hotelAggregatedInfo.ccy;
        bookingItemVM.allowedPaymentMethods = hotelAggregatedInfo.allowedPaymentMethods;

        bookingItemVM.customerNameString = "";
        bookingItemVM.initialCustomerId = "";
        bookingItemVM.customerList = [];
        bookingItemVM.transientBookingItem.customerIdList = [];
        bookingItemVM.transientBookingItem.defaultBillingDetails = this.getDefaultBillingDetails(hotelAggregatedInfo, priceProductItem);

        if (!this._thUtils.isUndefinedOrNull(bookingSearchResultDO.customer)) {
            bookingItemVM.customerNameString = bookingSearchResultDO.customer.customerName;
            bookingItemVM.customerList = [bookingSearchResultDO.customer];
            bookingItemVM.transientBookingItem.customerIdList = [bookingSearchResultDO.customer.id];
            bookingItemVM.initialCustomerId = bookingSearchResultDO.customer.id;
            if (bookingSearchResultDO.customer.customerDetails.canGuaranteePayment()) {
                bookingItemVM.transientBookingItem.defaultBillingDetails.customerId = bookingSearchResultDO.customer.id;
            }
        }
        bookingItemVM.updateValidationColumn();

        return bookingItemVM;
    }
    private getDefaultBillingDetails(hotelAggregatedInfo: HotelAggregatedInfo, priceProductItem: PriceProductItemDO): DefaultBillingDetailsDO {
        var billingDetails = new DefaultBillingDetailsDO();
        billingDetails.paymentGuarantee = false;
        billingDetails.paymentMethod = new InvoicePaymentMethodDO();
        billingDetails.paymentMethod.type = InvoicePaymentMethodType.DefaultPaymentMethod;
        billingDetails.paymentMethod.value = hotelAggregatedInfo.allowedPaymentMethods.paymentMethodList[0].paymentMethod.id;
        return billingDetails;
    }

    public createBookingCartItemVMListFromBookingVMList(hotelAggregatedInfo: HotelAggregatedInfo, bookingVMList: BookingVM[]): BookingCartItemVM[] {
        let bookingCartItemList = [];

        _.forEach(bookingVMList, (bookingVM: BookingVM, index: number) => {
            bookingCartItemList.push(this.createBookingCartItemVMFromBookingVM(hotelAggregatedInfo, bookingVM, index));
        });

        return bookingCartItemList;
    }

    private createBookingCartItemVMFromBookingVM(hotelAggregatedInfo: HotelAggregatedInfo, bookingVM: BookingVM, indexInCart: number): BookingCartItemVM {
        let bookingCartItem = new BookingCartItemVM();
        bookingCartItem.transientBookingItem = new TransientBookingItem();

        bookingCartItem.itemType = BookingCartItemVMType.NormalBooking;
        bookingCartItem.uniqueId = bookingVM.booking.priceProductSnapshot.id + bookingVM.roomCategory.id;
        bookingCartItem.priceProductName = bookingVM.booking.priceProductSnapshot.name;
        bookingCartItem.roomCategoryName = bookingVM.roomCategory.displayName;

        bookingCartItem.totalPrice = bookingVM.booking.price.totalBookingPrice
        bookingCartItem.totalPriceString = bookingVM.totalPriceString;
        bookingCartItem.conditionsString = bookingVM.booking.priceProductSnapshot.conditions.getCancellationConditionsString(this._thTranslation);
        bookingCartItem.constraintsString = bookingVM.booking.priceProductSnapshot.constraints.getBriefValueDisplayString(this._thTranslation);

        bookingCartItem.bookingCapacity = bookingVM.booking.configCapacity;

        bookingCartItem.transientBookingItem.configCapacity = bookingVM.booking.configCapacity;
        bookingCartItem.transientBookingItem.interval = bookingVM.booking.interval;
        bookingCartItem.transientBookingItem.notes = bookingVM.booking.notes;
        bookingCartItem.transientBookingItem.invoiceNotes = bookingVM.booking.invoiceNotes;

        bookingCartItem.bookingInterval = bookingVM.booking.interval;

        bookingCartItem.transientBookingItem.roomCategoryId = bookingVM.roomCategory.id;
        bookingCartItem.transientBookingItem.priceProductId = bookingVM.booking.priceProductSnapshot.id;

        bookingCartItem.priceProduct = bookingVM.booking.priceProductSnapshot;
        bookingCartItem.ccy = bookingVM.ccy;
        bookingCartItem.allowedPaymentMethods = hotelAggregatedInfo.allowedPaymentMethods;

        bookingCartItem.cartSequenceId = indexInCart;
        bookingCartItem.bookingId = bookingVM.booking.id;

        bookingCartItem.customerNameString = bookingVM.customerNameString;

        bookingCartItem.customerList = bookingVM.customerList;
        bookingCartItem.transientBookingItem.customerIdList = bookingVM.booking.customerIdList;
        bookingCartItem.transientBookingItem.defaultBillingDetails = bookingVM.booking.defaultBillingDetails;

        return bookingCartItem;
    }
}
