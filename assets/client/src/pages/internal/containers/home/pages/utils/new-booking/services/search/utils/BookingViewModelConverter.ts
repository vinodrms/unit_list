import {ThTranslation} from '../../../../../../../../../../common/utils/localization/ThTranslation';
import {ThUtils} from '../../../../../../../../../../common/utils/ThUtils';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import {ConfigCapacityDO} from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {BookingSearchResultDO} from '../data-objects/BookingSearchResultDO';
import {BookingCartItemVM, BookingCartItemVMType} from '../view-models/BookingCartItemVM';
import {RoomCategoryItemDO} from '../data-objects/room-category-item/RoomCategoryItemDO';
import {AllotmentItemDO} from '../data-objects/allotment-item/AllotmentItemDO';
import {PriceProductItemDO} from '../data-objects/price-product-item/PriceProductItemDO';
import {TransientBookingItem} from '../../data-objects/TransientBookingItem';
import {BookingSearchParams} from '../../data-objects/BookingSearchParams';
import {DefaultBillingDetailsDO} from '../../../../../../../../services/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {InvoicePaymentMethodDO, InvoicePaymentMethodType} from '../../../../../../../../services/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {HotelAggregatedInfo} from '../../../../../../../../services/hotel/utils/HotelAggregatedInfo';

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
        bookingItemVM.totalPrice = priceProductItem.getPriceForRoomCategory(roomCategoryItem.stats.roomCategory.id);
        bookingItemVM.totalPriceString = bookingItemVM.totalPrice + hotelAggregatedInfo.ccy.nativeSymbol;
        bookingItemVM.conditionsString = priceProductItem.priceProduct.conditions.getCancellationConditionsString(this._thTranslation);
        bookingItemVM.constraintsString = priceProductItem.priceProduct.constraints.getBriefValueDisplayString(this._thTranslation);

        bookingItemVM.bookingCapacity = new ConfigCapacityDO();
        bookingItemVM.bookingCapacity.buildFromObject(bookingSearchParams.configCapacity);

        bookingItemVM.transientBookingItem.configCapacity = bookingItemVM.bookingCapacity;
        bookingItemVM.transientBookingItem.interval = new ThDateIntervalDO();
        bookingItemVM.transientBookingItem.interval.buildFromObject(bookingSearchParams.interval);
        bookingItemVM.bookingInterval = bookingItemVM.transientBookingItem.interval;

        bookingItemVM.transientBookingItem.roomCategoryId = roomCategoryItem.stats.roomCategory.id;
        bookingItemVM.transientBookingItem.priceProductId = priceProductItem.priceProduct.id;

        bookingItemVM.priceProduct = priceProductItem.priceProduct;
        bookingItemVM.ccy = hotelAggregatedInfo.ccy;
        bookingItemVM.allowedPaymentMethods = hotelAggregatedInfo.allowedPaymentMethods;

        bookingItemVM.customerNameString = "";
        bookingItemVM.canChangeDefaultBillableCustomer = true;
        bookingItemVM.customerList = [];
        bookingItemVM.transientBookingItem.customerIdList = [];
        bookingItemVM.transientBookingItem.defaultBillingDetails = this.getDefaultBillingDetails(hotelAggregatedInfo, priceProductItem);

        if (!this._thUtils.isUndefinedOrNull(bookingSearchResultDO.customer)) {
            bookingItemVM.customerNameString = bookingSearchResultDO.customer.customerName;
            bookingItemVM.customerList = [bookingSearchResultDO.customer];
            bookingItemVM.transientBookingItem.customerIdList = [bookingSearchResultDO.customer.id];
            bookingItemVM.canChangeDefaultBillableCustomer = false;
            bookingItemVM.transientBookingItem.defaultBillingDetails.customerId = bookingSearchResultDO.customer.id;
        }
        bookingItemVM.updateValidationColumn();

        return bookingItemVM;
    }
    private getDefaultBillingDetails(hotelAggregatedInfo: HotelAggregatedInfo, priceProductItem: PriceProductItemDO): DefaultBillingDetailsDO {
        var billingDetails = new DefaultBillingDetailsDO();
        billingDetails.paymentGuarantee = false;
        billingDetails.paymentMethod = new InvoicePaymentMethodDO();
        billingDetails.paymentMethod.type = InvoicePaymentMethodType.DefaultPaymentMethod;
        billingDetails.paymentMethod.value = hotelAggregatedInfo.allowedPaymentMethods.paymentMethodList[0].id;
        return billingDetails;
    }
}