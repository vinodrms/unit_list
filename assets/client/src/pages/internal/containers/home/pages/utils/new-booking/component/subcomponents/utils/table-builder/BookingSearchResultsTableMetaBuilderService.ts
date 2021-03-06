import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType, TableColumnValueMeta} from '../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import {BookingCartItemVM} from '../../../../services/search/view-models/BookingCartItemVM';

@Injectable()
export class BookingSearchResultsTableMetaBuilderService {
    public static OverbookingClass = "overbooking";
    public static AvailableAllotmentClass = "allotment";

    constructor() { }

    public buildSearchResultsTableMeta(): LazyLoadTableMeta {
        return {
            supportedRowCommandList: [TableRowCommand.AddExistingRow, TableRowCommand.ShowDetails],
            rowIdPropertySelector: "uniqueId",
            addButtonText: "",
            autoSelectRows: false,
            columnMetaList: [
                {
                    displayName: "Price Prod",
                    valueMeta: {
                        objectPropertyId: "priceProductName",
                        propertyType: TablePropertyType.NotesType,
                        showInCollapsedView: true,
                        normalStyle: "up-col-15p left selectable-row",
                        collapsedStyle: "up-col-70p left",
                        isSortable: true
                    }
                },
                {
                    displayName: "Room",
                    valueMeta: {
                        objectPropertyId: "roomCategoryName",
                        propertyType: TablePropertyType.NotesType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-15p left selectable-row",
                        isSortable: true
                    }
                },
                {
                    displayName: "Max Cap",
                    valueMeta: {
                        objectPropertyId: "roomCapacity",
                        propertyType: TablePropertyType.CapacityType,
                        fonts: {
                            child: ";",
                            adult: ":",
                            baby: "B"
                        },
                        showInCollapsedView: false,
                        normalStyle: "up-col-10p center selectable-row",
                        isSortable: true
                    }
                },
                {
                    displayName: "Avail",
                    valueMeta: {
                        objectPropertyId: "noAvailableRooms",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-5p center selectable-row",
                        isSortable: true
                    }
                },
                {
                    displayName: "Allot",
                    valueMeta: {
                        objectPropertyId: "noAvailableAllotmentsString",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-5p center selectable-row",
                        isSortable: true
                    }
                },
                {
                    displayName: "Price",
                    valueMeta: {
                        objectPropertyId: "totalPriceString",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-10p center selectable-row",
                        isSortable: true
                    }
                },
                {
                    displayName: "Conditions",
                    valueMeta: {
                        objectPropertyId: "conditionsString",
                        propertyType: TablePropertyType.NotesType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-20p center"
                    }
                },
                {
                    displayName: "Constraints",
                    valueMeta: {
                        objectPropertyId: "constraintsString",
                        propertyType: TablePropertyType.NotesType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-20p center"
                    }
                }
            ]
        }
    }

    public customCellClassGenerator(bookingCartItem: BookingCartItemVM, columnValueMeta: TableColumnValueMeta): string {
        if (columnValueMeta.objectPropertyId === 'noAvailableRooms' && bookingCartItem.noAvailableRooms <= 0) {
            return BookingSearchResultsTableMetaBuilderService.OverbookingClass;
        }
        if (columnValueMeta.objectPropertyId === 'noAvailableAllotmentsString' && bookingCartItem.noAvailableAllotments > 0) {
            return BookingSearchResultsTableMetaBuilderService.AvailableAllotmentClass;
        }
        return "";
    }
}