import { Injectable } from '@angular/core';
import { AppContext } from '../../../../../../../../../../../common/utils/AppContext';
import { TableRowCommand, TableColumnValueMeta } from '../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { BookingCartItemVM, BookingCartItemVMType } from '../../../../services/search/view-models/BookingCartItemVM';
import { BookingCartService } from '../../../../services/search/BookingCartService';
import { ConfigCapacityDO } from '../../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';

import * as _ from "underscore";

@Injectable()
export class BookingTableUtilsService {
    public static TotalsClass = "lazy-loading-table-totals";

    constructor(private _appContext: AppContext) {
    }

    public customCellClassGeneratorForBookingCart(bookingCartItem: BookingCartItemVM, columnValueMeta: TableColumnValueMeta): string {
        if (bookingCartItem.itemType === BookingCartItemVMType.Total || !bookingCartItem.isNew()) {
            var className = "default-cursor";
            if (columnValueMeta.objectPropertyId === "priceProductName" || columnValueMeta.objectPropertyId === "totalPriceString") {
                className += " important";
            }
            return className;
        }
        if (columnValueMeta.objectPropertyId === 'validationColumnFontName') {
            return bookingCartItem.validationColumnClassName;
        }
        return "";
    }
    public customRowClassGeneratorForBookingCart(bookingCartItem: BookingCartItemVM): string {
        if (bookingCartItem.itemType === BookingCartItemVMType.Total) {
            return BookingTableUtilsService.TotalsClass;
        }
        return "";
    }
    public canPerformCommandOnItemForBookingCart(bookingCartItem: BookingCartItemVM, command: TableRowCommand): boolean {
        return bookingCartItem.itemType !== BookingCartItemVMType.Total && bookingCartItem.isNew();
    }

    public updateBookingCartTotalsRow(bookingCartService: BookingCartService) {
        if (bookingCartService.bookingItemVMList.length == 0) {
            bookingCartService.totalsBookingItem = null;
            return;
        }
        var totalsBookingItem = new BookingCartItemVM();
        totalsBookingItem.itemType = BookingCartItemVMType.Total;
        totalsBookingItem.uniqueId = "";
        totalsBookingItem.priceProductName = this._appContext.thTranslation.translate("Totals");
        totalsBookingItem.bookingCapacity = new ConfigCapacityDO();
        totalsBookingItem.bookingCapacity.noAdults = 0;
        totalsBookingItem.bookingCapacity.noChildren = 0;
        totalsBookingItem.bookingCapacity.noBabies = 0;
        totalsBookingItem.bookingCapacity.noBabyBeds = 0;
        var totalPrice = 0;
        _.forEach(bookingCartService.bookingItemVMList, (bookingItem: BookingCartItemVM) => {
            totalPrice += bookingItem.totalPrice;
            totalsBookingItem.bookingCapacity.noAdults += bookingItem.bookingCapacity.noAdults;
            totalsBookingItem.bookingCapacity.noChildren += bookingItem.bookingCapacity.noChildren;
            totalsBookingItem.bookingCapacity.noBabies += bookingItem.bookingCapacity.noBabies;
            totalsBookingItem.bookingCapacity.noBabyBeds += bookingItem.bookingCapacity.noBabyBeds;
        });
        totalsBookingItem.totalPrice = totalPrice;
        totalsBookingItem.totalPriceString = totalPrice + bookingCartService.bookingItemVMList[0].ccy.nativeSymbol;
        totalsBookingItem.roomCategoryName = this.getNoRoomsText(bookingCartService.bookingItemVMList.length);

        bookingCartService.totalsBookingItem = totalsBookingItem;
    }
    private getNoRoomsText(noRooms: number): string {
        var noRoomsText: string = noRooms > 1 ? "%noRooms% Rooms" : "%noRooms% Room";
        return this._appContext.thTranslation.translate(noRoomsText, { noRooms: noRooms });
    }
}