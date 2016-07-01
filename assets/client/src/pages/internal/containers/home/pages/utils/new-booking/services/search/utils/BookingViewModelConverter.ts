import {ThTranslation} from '../../../../../../../../../../common/utils/localization/ThTranslation';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import {ConfigCapacityDO} from '../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {BookingSearchResultDO} from '../data-objects/BookingSearchResultDO';
import {BookingItemVM} from '../view-models/BookingItemVM';
import {RoomCategoryItemDO} from '../data-objects/room-category-item/RoomCategoryItemDO';
import {AllotmentItemDO} from '../data-objects/allotment-item/AllotmentItemDO';
import {PriceProductItemDO} from '../data-objects/price-product-item/PriceProductItemDO';
import {TransientBookingItem} from '../../data-objects/TransientBookingItem';
import {BookingSearchParams} from '../../data-objects/BookingSearchParams';

export class BookingViewModelConverter {

    constructor(private _thTranslation: ThTranslation) { }

    public convertSearchResultToVMList(bookingSearchResultDO: BookingSearchResultDO, bookingSearchParams: BookingSearchParams, currency: CurrencyDO): BookingItemVM[] {
        var bookingItemVMList: BookingItemVM[] = [];
        _.forEach(bookingSearchResultDO.roomCategoryItemList, (roomCategoryItem: RoomCategoryItemDO) => {
            bookingItemVMList = bookingItemVMList.concat(this.getBookingSearchResultForRoom(roomCategoryItem, bookingSearchResultDO, bookingSearchParams, currency));
        });
        return bookingItemVMList;
    }

    private getBookingSearchResultForRoom(roomCategoryItem: RoomCategoryItemDO, bookingSearchResultDO: BookingSearchResultDO, bookingSearchParams: BookingSearchParams, currency: CurrencyDO): BookingItemVM[] {
        var bookingItemVMList: BookingItemVM[] = [];

        var addedPriceProductIdByRoomCateg: { [index: string]: string; } = {};

        var allotmentItemDOList: AllotmentItemDO[] = bookingSearchResultDO.getAllotmentsFilteredByRoomCategory(roomCategoryItem.stats.roomCategory.id);
        _.forEach(allotmentItemDOList, (allotmentItem: AllotmentItemDO) => {
            if (allotmentItem.noOccupiedAllotments < allotmentItem.noTotalAllotments) {
                var priceProductItem = bookingSearchResultDO.getPriceProductItemById(allotmentItem.priceProductId);
                if (priceProductItem) {
                    bookingItemVMList.push(this.createBookingItemVM(bookingSearchParams, roomCategoryItem, priceProductItem, currency, allotmentItem));
                    addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id] = roomCategoryItem.stats.roomCategory.id;
                }
            }
        });
        var priceProductItemList: PriceProductItemDO[] = bookingSearchResultDO.getPriceProductsFilteredByIds(roomCategoryItem.priceProductIdList);
        _.forEach(priceProductItemList, (priceProductItem: PriceProductItemDO) => {
            if (!addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id]
                || addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id] != roomCategoryItem.stats.roomCategory.id) {
                bookingItemVMList.push(this.createBookingItemVM(bookingSearchParams, roomCategoryItem, priceProductItem, currency));
                addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id] = roomCategoryItem.stats.roomCategory.id;
            }
        });

        return bookingItemVMList;
    }

    private createBookingItemVM(bookingSearchParams: BookingSearchParams, roomCategoryItem: RoomCategoryItemDO, priceProductItem: PriceProductItemDO, currency: CurrencyDO, allotmentItem?: AllotmentItemDO): BookingItemVM {
        var bookingItemVM = new BookingItemVM();
        bookingItemVM.transientBookingItem = new TransientBookingItem();

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
        bookingItemVM.totalPriceString = bookingItemVM.totalPrice + currency.nativeSymbol;
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

        return bookingItemVM;
    }
}