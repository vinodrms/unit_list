import {Injectable} from 'angular2/core';
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
						showInCollapsedView: true
					}
				},
                {
					displayName: "Category",
					valueMeta: {
						objectPropertyId: "category.displayName",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				},
                {
					displayName: "Floor",
					valueMeta: {
						objectPropertyId: "room.floor",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
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
						showInCollapsedView: false
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "room.notes",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				}
			]
		}
	}
}