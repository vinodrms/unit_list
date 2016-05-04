import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class CustomerRegisterTableMetaBuilderService {
	constructor() { }
	public buildLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Edit, TableRowCommand.Select, TableRowCommand.Add, TableRowCommand.Search],
			rowIdPropertySelector: "customer.id",
			addButtonText: "Customer",
			searchInputPlaceholder: "Search by name, address, email ..",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Customer Name",
					valueMeta: {
						objectPropertyId: "customerNameString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true
					}
				},
				{
					displayName: "Customer Type",
					valueMeta: {
						objectPropertyId: "customerTypeString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				},
				{
					displayName: "Address",
					valueMeta: {
						objectPropertyId: "customerAddressString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "customer.notes",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false
					}
				}
			]
		}
	}
}