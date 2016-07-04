import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType, TableColumnValueMeta} from '../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

interface BookingCartColumnMetas {
    priceProductName: TableColumnMeta;
    roomName: TableColumnMeta;
    period: TableColumnMeta;
    noPeople: TableColumnMeta;
    price: TableColumnMeta;
    conditions: TableColumnMeta;
    constrains: TableColumnMeta;
    customer: TableColumnMeta;
    validationColumn: TableColumnMeta;
}

@Injectable()
export class BookingCartTableMetaBuilderService {
    public buildBookingCartPreviewTableMeta(): LazyLoadTableMeta {
        var bookingCartColumnMetas = this.getBookingCartColumnMetas();
        bookingCartColumnMetas.priceProductName.valueMeta.normalStyle = "up-col-25p left";
        bookingCartColumnMetas.roomName.valueMeta.normalStyle = "up-col-20p left";
        bookingCartColumnMetas.period.valueMeta.normalStyle = "up-col-30p left";
        bookingCartColumnMetas.noPeople.valueMeta.normalStyle = "up-col-10p center";
        bookingCartColumnMetas.price.valueMeta.normalStyle = "up-col-10p center";

        return {
            supportedRowCommandList: [TableRowCommand.Delete],
            rowIdPropertySelector: "cartSequenceId",
            addButtonText: "",
            autoSelectRows: false,
            noResultsPlaceholder: "Add at least one price product in the cart to continue",
            columnMetaList: [
                bookingCartColumnMetas.priceProductName,
                bookingCartColumnMetas.roomName,
                bookingCartColumnMetas.period,
                bookingCartColumnMetas.noPeople,
                bookingCartColumnMetas.price
            ]
        };
    }

    public buildBookingCartTableMeta(): LazyLoadTableMeta {
        var bookingCartColumnMetas = this.getBookingCartColumnMetas();
        return {
            supportedRowCommandList: [TableRowCommand.Select],
            rowIdPropertySelector: "cartSequenceId",
            autoSelectRows: false,
            columnMetaList: [
                bookingCartColumnMetas.priceProductName,
                bookingCartColumnMetas.roomName,
                bookingCartColumnMetas.period,
                bookingCartColumnMetas.noPeople,
                bookingCartColumnMetas.price,
                bookingCartColumnMetas.conditions,
                bookingCartColumnMetas.constrains,
                bookingCartColumnMetas.customer,
                bookingCartColumnMetas.validationColumn
            ]
        };
    }

    private getBookingCartColumnMetas(): BookingCartColumnMetas {
        return {
            priceProductName: {
                displayName: "Price Product",
                valueMeta: {
                    objectPropertyId: "priceProductName",
                    propertyType: TablePropertyType.NotesType,
                    showInCollapsedView: true,
                    normalStyle: "up-col-10p left",
                    collapsedStyle: "up-col-70p left"
                }
            },
            roomName: {
                displayName: "Room",
                valueMeta: {
                    objectPropertyId: "roomCategoryName",
                    propertyType: TablePropertyType.NotesType,
                    showInCollapsedView: false,
                    normalStyle: "up-col-10p left"
                }
            },
            period: {

                displayName: "Period",
                valueMeta: {
                    objectPropertyId: "bookingInterval",
                    propertyType: TablePropertyType.DateIntervalType,
                    showInCollapsedView: false,
                    normalStyle: "up-col-15p left"
                }

            },
            noPeople: {
                displayName: "No People",
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
            price: {

                displayName: "Price",
                valueMeta: {
                    objectPropertyId: "totalPriceString",
                    propertyType: TablePropertyType.StringType,
                    showInCollapsedView: false,
                    normalStyle: "up-col-5p center"
                }

            },
            conditions: {

                displayName: "Conditions",
                valueMeta: {
                    objectPropertyId: "conditionsString",
                    propertyType: TablePropertyType.NotesType,
                    showInCollapsedView: false,
                    normalStyle: "up-col-15p center"
                }

            },
            constrains: {

                displayName: "Constraints",
                valueMeta: {
                    objectPropertyId: "constraintsString",
                    propertyType: TablePropertyType.NotesType,
                    showInCollapsedView: false,
                    normalStyle: "up-col-15p center"
                }

            },
            customer: {
                displayName: "Customer",
                valueMeta: {
                    objectPropertyId: "customerNameString",
                    propertyType: TablePropertyType.NotesType,
                    showInCollapsedView: false,
                    normalStyle: "up-col-15p center"
                }
            },
            validationColumn: {
                displayName: "",
                valueMeta: {
                    objectPropertyId: "validationColumnFontName",
                    propertyType: TablePropertyType.FontIconType,
                    showInCollapsedView: false,
                    normalStyle: "up-col-5p center"
                }
            }
        }
    }
}