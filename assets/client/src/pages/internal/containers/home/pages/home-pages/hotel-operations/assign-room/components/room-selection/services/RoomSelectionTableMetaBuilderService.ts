import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TablePropertyType, TableColumnValueMeta} from '../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import {AssignableRoomVM} from './view-models/AssignableRoomVM';

@Injectable()
export class RoomSelectionTableMetaBuilderService {
    public static RedClass = "red-color";
    public static GreenClass = "green-color";
    public static DimmedClass = "dimmed-item";
    public static DefaultCursorClass = "default-cursor";

    constructor() { }
    public buildLazyLoadTableMeta(): LazyLoadTableMeta {
        return {
            supportedRowCommandList: [TableRowCommand.Select],
            rowIdPropertySelector: "roomVM.room.id",
            autoSelectRows: false,
            columnMetaList: [
                {
                    displayName: "Room",
                    valueMeta: {
                        objectPropertyId: "roomName",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: true,
                        normalStyle: "up-col-25p left",
                        collapsedStyle: "up-col-70p left"
                    }
                },
                {
                    displayName: "Room Category",
                    valueMeta: {
                        objectPropertyId: "roomCategoryName",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-25p left selectable-row",
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
                        normalStyle: "up-col-20p center selectable-row",
                        isSortable: true
                    }
                },
                {
                    displayName: "",
                    valueMeta: {
                        objectPropertyId: "fontName",
                        dependentObjectPropertyId: "errorMessage",
                        propertyType: TablePropertyType.FontIconWithTextType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-25p center"
                    }
                }
            ]
        }
    }

    public customCellClassGeneratorForBookingCart(assignableRoomVM: AssignableRoomVM, columnValueMeta: TableColumnValueMeta): string {
        var className = "";
        if (!assignableRoomVM.isAssignableToBooking) {
            className = RoomSelectionTableMetaBuilderService.DefaultCursorClass;
        }
        if (columnValueMeta.objectPropertyId === 'fontName') {
            if (assignableRoomVM.isAssignableToBooking) {
                className += " " + RoomSelectionTableMetaBuilderService.GreenClass;
            }
            className += " " + RoomSelectionTableMetaBuilderService.RedClass;
        }
        return className;
    }
    public customRowClassGeneratorForBookingCart(assignableRoomVM: AssignableRoomVM): string {
        if (!assignableRoomVM.isAssignableToBooking) {
            return RoomSelectionTableMetaBuilderService.DimmedClass;
        }
        return "";
    }
}