import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType, TableColumnValueMeta} from '../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import {BookingResultVM} from '../../../../services/search/view-models/BookingResultVM';

@Injectable()
export class BookingSearchTableMetaBuilderService {
    public static OverbookingClass = "overbooking";
    public static AvailableAllotmentClass = "allotment";

    constructor() { }

    public buildLazyLoadTableMeta(): LazyLoadTableMeta {
        return {
            supportedRowCommandList: [TableRowCommand.AddExistingRow],
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
                    displayName: "Capacity",
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
    public customCellClassGenerator(bookingResult: BookingResultVM, columnValueMeta: TableColumnValueMeta): string {
        if (columnValueMeta.objectPropertyId === 'noAvailableRooms' && bookingResult.noAvailableRooms <= 0) {
            return BookingSearchTableMetaBuilderService.OverbookingClass;
        }
        if (columnValueMeta.objectPropertyId === 'noAvailableAllotmentsString' && bookingResult.noAvailableAllotments > 0) {
            return BookingSearchTableMetaBuilderService.AvailableAllotmentClass;
        }
        return "";
    }
}