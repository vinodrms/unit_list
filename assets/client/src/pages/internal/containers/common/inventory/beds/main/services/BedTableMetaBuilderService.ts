import {Injectable} from '@angular/core';
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
						showInCollapsedView: false,
						normalStyle: "up-col-5p center",
					}
				},
				{
					displayName: "Name",
					valueMeta: {
						objectPropertyId: "bed.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true,
						normalStyle: "up-col-25p left",
						collapsedStyle: "up-col-70p left"
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
					displayName: "Size",
					valueMeta: {
						objectPropertyId: "size",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "bed.notes",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-40p left"
					}
				}
			]
		}
	}
}