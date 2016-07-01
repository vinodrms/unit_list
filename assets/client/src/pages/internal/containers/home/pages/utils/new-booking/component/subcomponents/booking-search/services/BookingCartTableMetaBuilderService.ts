import {Injectable} from '@angular/core';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType, TableColumnValueMeta} from '../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import {BookingItemVM, BookingItemVMType} from '../../../../services/search/view-models/BookingItemVM';
import {BookingCartService} from '../../../../services/search/BookingCartService';
import {ConfigCapacityDO} from '../../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import {CurrencyDO} from '../../../../../../../../../services/common/data-objects/currency/CurrencyDO';

@Injectable()
export class BookingCartTableMetaBuilderService {
    public static TotalsClass = "lazy-loading-table-totals";

    constructor(private _appContext: AppContext) {
    }
    public buildBookingCartTableMeta(): LazyLoadTableMeta {
        return {
            supportedRowCommandList: [TableRowCommand.Delete],
            rowIdPropertySelector: "uniqueId",
            addButtonText: "",
            autoSelectRows: false,
            noResultsPlaceholder: "Add at least one price product in the cart to continue",
            columnMetaList: [
                {
                    displayName: "Price Product",
                    valueMeta: {
                        objectPropertyId: "priceProductName",
                        propertyType: TablePropertyType.NotesType,
                        showInCollapsedView: true,
                        normalStyle: "up-col-25p left",
                        collapsedStyle: "up-col-70p left"
                    }
                },
                {
                    displayName: "Room",
                    valueMeta: {
                        objectPropertyId: "roomCategoryName",
                        propertyType: TablePropertyType.NotesType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-20p left"
                    }
                },
                {
                    displayName: "Period",
                    valueMeta: {
                        objectPropertyId: "bookingInterval",
                        propertyType: TablePropertyType.DateIntervalType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-30p left"
                    }
                },
                {
                    displayName: "Capacity",
                    valueMeta: {
                        objectPropertyId: "bookingCapacity",
                        propertyType: TablePropertyType.CapacityType,
                        fonts: {
                            child: ";",
                            adult: ":",
                            baby: "B"
                        },
                        showInCollapsedView: false,
                        normalStyle: "up-col-10p center"
                    }
                },
                {
                    displayName: "Price",
                    valueMeta: {
                        objectPropertyId: "totalPriceString",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-10p center"
                    }
                }
            ]
        }
    }

    public customCellClassGenerator(bookingItem: BookingItemVM, columnValueMeta: TableColumnValueMeta): string {
        if (bookingItem.itemType === BookingItemVMType.Total) {
            var className = "default-cursor";
            if (columnValueMeta.objectPropertyId === "priceProductName" || columnValueMeta.objectPropertyId === "totalPriceString") {
                className += " important";
            }
            return className;
        }
        return "";
    }
    public customRowClassGenerator(bookingItem: BookingItemVM): string {
        if (bookingItem.itemType === BookingItemVMType.Total) {
            return BookingCartTableMetaBuilderService.TotalsClass;
        }
        return "";
    }
    public canPerformCommandOnItem(bookingItem: BookingItemVM, command: TableRowCommand): boolean {
        return bookingItem.itemType !== BookingItemVMType.Total;
    }

    public updateBookingCartTotalsRow(bookingCartService: BookingCartService) {
        console.log(bookingCartService.bookingItemVMList);
        if (bookingCartService.bookingItemVMList.length == 0) {
            bookingCartService.totalsBookingItem = null;
            return;
        }
        var totalsBookingItem = new BookingItemVM();
        totalsBookingItem.itemType = BookingItemVMType.Total;
        totalsBookingItem.uniqueId = "";
        totalsBookingItem.priceProductName = this._appContext.thTranslation.translate("Totals");
        totalsBookingItem.bookingCapacity = new ConfigCapacityDO();
        totalsBookingItem.bookingCapacity.noAdults = 0;
        totalsBookingItem.bookingCapacity.noChildren = 0;
        totalsBookingItem.bookingCapacity.noBabies = 0;
        var totalPrice = 0;
        _.forEach(bookingCartService.bookingItemVMList, (bookingItem: BookingItemVM) => {
            totalPrice += bookingItem.totalPrice;
            totalsBookingItem.bookingCapacity.noAdults += bookingItem.bookingCapacity.noAdults;
            totalsBookingItem.bookingCapacity.noChildren += bookingItem.bookingCapacity.noChildren;
            totalsBookingItem.bookingCapacity.noBabies += bookingItem.bookingCapacity.noBabies;
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