import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class RoomTableMetaBuilderService {
	constructor() { }
	public buildLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Copy, TableRowCommand.Delete, TableRowCommand.Edit, TableRowCommand.Select, TableRowCommand.Add, TableRowCommand.Search],
			rowIdPropertySelector: "room.id",
			addButtonText: "Room",
			searchInputPlaceholder: "Search by name",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Name",
					valueMeta: {
						objectPropertyId: "room.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true,
						normalStyle: "up-col-25p left",
						collapsedStyle: "up-col-70p left"
					}
				},
                {
					displayName: "Category",
					valueMeta: {
						objectPropertyId: "category.displayName",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-25p left"
					}
				},
                {
					displayName: "Floor",
					valueMeta: {
						objectPropertyId: "room.floor",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "Capacity",
					valueMeta: {
						objectPropertyId: "capacity",
						propertyType: TablePropertyType.CapacityType,
						fonts: {
                            child: ";",
                            adult: ":"    
                        },
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "room.notes",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p left"
					}
				}
			]
		}
	}
}