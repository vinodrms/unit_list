import {Injectable} from 'angular2/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class CustomerRegisterTableMetaBuilderService {
	constructor() { }
	public buildLazyLoadTableMeta(filterBreakfastCategory: boolean): LazyLoadTableMeta {
		// TODO: UPDATE
		return {
			supportedRowCommandList: [TableRowCommand.Copy, TableRowCommand.Edit, TableRowCommand.Select, TableRowCommand.Add, TableRowCommand.Search],
			rowIdPropertySelector: "addOnProduct.id",
			addButtonText: "Customer Register",
			searchInputPlaceholder: "Search by name, address, email ..",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Customer Name",
					valueMeta: {
						objectPropertyId: "addOnProduct.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true
					}
				}
			]
		}
	}
}