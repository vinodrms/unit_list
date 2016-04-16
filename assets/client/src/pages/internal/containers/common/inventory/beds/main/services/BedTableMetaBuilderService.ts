import {Injectable} from 'angular2/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class BedTableMetaBuilderService {
	constructor() { }
	public buildLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Copy, TableRowCommand.Delete, TableRowCommand.Edit, TableRowCommand.Select, TableRowCommand.Add, TableRowCommand.Search],
			rowIdPropertySelector: "bed.id",
			addButtonText: "Bed",
			searchInputPlaceholder: "Search by name",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Type",
					valueMeta: {
						objectPropertyId: "template.iconUrl",
						propertyType: TablePropertyType.FontIconType,
						showInCollapsedView: true
					}
				},
				{
					displayName: "Name",
					valueMeta: {
						objectPropertyId: "bed.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true
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
					displayName: "Size",
					valueMeta: {
						objectPropertyId: "size",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "bed.notes",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				}
			]
		}
	}
}