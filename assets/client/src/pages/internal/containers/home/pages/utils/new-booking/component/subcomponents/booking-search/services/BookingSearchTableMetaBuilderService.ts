import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class BookingSearchTableMetaBuilderService {
	constructor() { }

	public buildLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [],
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
						normalStyle: "up-col-15p center",
						collapsedStyle: "up-col-70p center",
                        isSortable: true
					}
				},
				{
					displayName: "Room",
					valueMeta: {
						objectPropertyId: "roomCategoryName",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center",
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
						normalStyle: "up-col-10p center",
                        isSortable: true
					}
				},
				{
					displayName: "Avail",
					valueMeta: {
						objectPropertyId: "noAvailableRooms",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-5p center",
                        isSortable: true
					}
				},
				{
					displayName: "Allot",
					valueMeta: {
						objectPropertyId: "noAvailableAllotmentsString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-5p center",
                        isSortable: true
					}
				},
                {
					displayName: "Price",
					valueMeta: {
						objectPropertyId: "totalPrice",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-10p center",
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
}