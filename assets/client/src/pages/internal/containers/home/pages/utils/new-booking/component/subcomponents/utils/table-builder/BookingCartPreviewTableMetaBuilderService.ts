import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType, TableColumnValueMeta} from '../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class BookingCartPreviewTableMetaBuilderService {
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
}