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
					displayName: "Name",
					valueMeta: {
						objectPropertyId: "customerNameString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true,
						normalStyle: "up-col-30p left",
						collapsedStyle: "up-col-70p left"
					}
				},
				{
					displayName: "Booking Code",
					valueMeta: {
						objectPropertyId: "customer.priceProductDetails.bookingCode",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center"
					}
				},
				{
					displayName: "Type",
					valueMeta: {
						objectPropertyId: "customerTypeFont",
						propertyType: TablePropertyType.FontIconType,
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "Address",
					valueMeta: {
						objectPropertyId: "customerAddressString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p center"
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "customer.notes",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-25p left"
					}
				}
			]
		}
	}
}