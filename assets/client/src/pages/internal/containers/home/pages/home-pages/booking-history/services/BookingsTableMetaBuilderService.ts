import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class BookingsTableMetaBuilderService {
    constructor() { }

    public buildLazyLoadTableMeta(): LazyLoadTableMeta {
        return {
            supportedRowCommandList: [TableRowCommand.Edit, TableRowCommand.Select, TableRowCommand.Add, TableRowCommand.Search],
            rowIdPropertySelector: "booking.bookingId",
            addButtonText: "Booking",
            searchInputPlaceholder: "Customer Name or References",
            autoSelectRows: true,
            columnMetaList: [
                {
                    displayName: "Price Product",
                    valueMeta: {
                        objectPropertyId: "booking.priceProductSnapshot.name",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: true,
                        normalStyle: "up-col-15p left",
                        collapsedStyle: "up-col-70p left"
                    }
                },
                {
                    displayName: "Room",
                    valueMeta: {
                        objectPropertyId: "roomCategory.displayName",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-15p left"
                    }
                },
                {
                    displayName: "Period",
                    valueMeta: {
                        objectPropertyId: "booking.interval",
                        propertyType: TablePropertyType.DateIntervalType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-20p center"
                    }
                },
                {
                    displayName: "No People",
                    valueMeta: {
                        objectPropertyId: "booking.configCapacity",
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
                        normalStyle: "up-col-5p center"
                    }
                },
                {
                    displayName: "Customer",
                    valueMeta: {
                        objectPropertyId: "customerNameString",
                        propertyType: TablePropertyType.NotesType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-20p center"
                    }
                },
                {

                    displayName: "Status",
                    valueMeta: {
                        objectPropertyId: "bookingMeta.displayName",
                        propertyType: TablePropertyType.NotesType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-10p center"
                    }
                },
            ]
        }
    }
}