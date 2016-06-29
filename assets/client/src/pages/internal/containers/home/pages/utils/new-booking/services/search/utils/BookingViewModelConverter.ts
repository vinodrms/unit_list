import {ThTranslation} from '../../../../../../../../../../common/utils/localization/ThTranslation';
import {BookingSearchResultDO} from '../data-objects/BookingSearchResultDO';
import {BookingResultVM} from '../view-models/BookingResultVM';
import {RoomCategoryItemDO} from '../data-objects/room-category-item/RoomCategoryItemDO';
import {AllotmentItemDO} from '../data-objects/allotment-item/AllotmentItemDO';
import {PriceProductItemDO} from '../data-objects/price-product-item/PriceProductItemDO';
import {TransientBookingItem} from '../../data-objects/TransientBookingItem';
import {BookingSearchParams} from '../../data-objects/BookingSearchParams';

export class BookingViewModelConverter {

    constructor(private _thTranslation: ThTranslation) { }

    public convertSearchResultToVMList(bookingSearchResultDO: BookingSearchResultDO, bookingSearchParams: BookingSearchParams): BookingResultVM[] {
        var bookingResultVMList: BookingResultVM[] = [];
        _.forEach(bookingSearchResultDO.roomCategoryItemList, (roomCategoryItem: RoomCategoryItemDO) => {
            bookingResultVMList = bookingResultVMList.concat(this.getBookingSearchResultForRoom(roomCategoryItem, bookingSearchResultDO, bookingSearchParams));
        });
        return bookingResultVMList;
    }

    private getBookingSearchResultForRoom(roomCategoryItem: RoomCategoryItemDO, bookingSearchResultDO: BookingSearchResultDO, bookingSearchParams: BookingSearchParams): BookingResultVM[] {
        var bookingResultVMList: BookingResultVM[] = [];

        var addedPriceProductIdByRoomCateg: { [index: string]: string; } = {};

        var allotmentItemDOList: AllotmentItemDO[] = bookingSearchResultDO.getAllotmentsFilteredByRoomCategory(roomCategoryItem.stats.roomCategory.id);
        _.forEach(allotmentItemDOList, (allotmentItem: AllotmentItemDO) => {
            if (allotmentItem.noOccupiedAllotments < allotmentItem.noTotalAllotments) {
                var priceProductItem = bookingSearchResultDO.getPriceProductItemById(allotmentItem.priceProductId);
                if (priceProductItem) {
                    bookingResultVMList.push(this.createBookingResultVM(bookingSearchParams, roomCategoryItem, priceProductItem, allotmentItem));
                    addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id] = roomCategoryItem.stats.roomCategory.id;
                }
            }
        });
        var priceProductItemList: PriceProductItemDO[] = bookingSearchResultDO.getPriceProductsFilteredByRoomCategory(roomCategoryItem.stats.roomCategory.id);
        _.forEach(priceProductItemList, (priceProductItem: PriceProductItemDO) => {
            if (!addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id]
                || addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id] != roomCategoryItem.stats.roomCategory.id) {
                bookingResultVMList.push(this.createBookingResultVM(bookingSearchParams, roomCategoryItem, priceProductItem));
                addedPriceProductIdByRoomCateg[priceProductItem.priceProduct.id] = roomCategoryItem.stats.roomCategory.id;
            }
        });

        return bookingResultVMList;
    }

    private createBookingResultVM(bookingSearchParams: BookingSearchParams, roomCategoryItem: RoomCategoryItemDO, priceProductItem: PriceProductItemDO, allotmentItem?: AllotmentItemDO): BookingResultVM {
        var bookingResultVM = new BookingResultVM();
        bookingResultVM.transientBookingItem = new TransientBookingItem();

        bookingResultVM.uniqueId = priceProductItem.priceProduct.id + roomCategoryItem.stats.roomCategory.id;
        bookingResultVM.priceProductName = priceProductItem.priceProduct.name;
        bookingResultVM.roomCategoryName = roomCategoryItem.stats.roomCategory.displayName;
        bookingResultVM.roomCapacity = roomCategoryItem.stats.capacity.totalCapacity;
        bookingResultVM.noAvailableRooms = roomCategoryItem.stats.noOfRooms - roomCategoryItem.noOccupiedRooms;
        if (!allotmentItem) {
            bookingResultVM.noAvailableAllotmentsString = "n/a";
        }
        else {
            bookingResultVM.noAvailableAllotmentsString = (allotmentItem.noTotalAllotments - allotmentItem.noOccupiedAllotments) + "";
            bookingResultVM.transientBookingItem.allotmentId = allotmentItem.allotment.id;
        }
        bookingResultVM.totalPrice = priceProductItem.getPriceForRoomCategory(roomCategoryItem.stats.roomCategory.id);
        bookingResultVM.conditionsString = priceProductItem.priceProduct.conditions.getCancellationConditionsString(this._thTranslation);
        bookingResultVM.constraintsString = priceProductItem.priceProduct.constraints.getBriefValueDisplayString(this._thTranslation);

        bookingResultVM.transientBookingItem.configCapacity = bookingSearchParams.configCapacity;
        bookingResultVM.transientBookingItem.interval = bookingSearchParams.interval;
        bookingResultVM.transientBookingItem.roomCategoryId = roomCategoryItem.stats.roomCategory.id;
        bookingResultVM.transientBookingItem.priceProductId = priceProductItem.priceProduct.id;

        return bookingResultVM;
    }
}