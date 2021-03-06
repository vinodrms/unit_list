import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class AllotmentsTableMetaBuilderService {
	constructor() { }

	public buildLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Edit, TableRowCommand.Select, TableRowCommand.Add, TableRowCommand.Search],
			rowIdPropertySelector: "allotment.id",
			addButtonText: "Allotment",
			searchInputPlaceholder: "Search by notes",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Customer",
					valueMeta: {
						objectPropertyId: "customer.customerName",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true,
						normalStyle: "up-col-20p left",
						collapsedStyle: "up-col-70p left"
					}
				},
				{
					displayName: "Price Product",
					valueMeta: {
						objectPropertyId: "priceProduct.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p left"
					}
				},
				{
					displayName: "Room",
					valueMeta: {
						objectPropertyId: "roomCategory.displayName",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p left"
					}
				},
				{
					displayName: "Period",
					valueMeta: {
						objectPropertyId: "allotment.openInterval",
						propertyType: TablePropertyType.DateIntervalType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p left"
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "allotment.notes",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p left"
					}
				}
			]
		}
	}
}