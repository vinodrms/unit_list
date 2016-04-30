import {Injectable} from 'angular2/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class PriceProductTableMetaBuilderService {
	constructor() { }

	public buildLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Copy, TableRowCommand.Edit, TableRowCommand.Select, TableRowCommand.Add, TableRowCommand.Search],
			rowIdPropertySelector: "priceProduct.id",
			addButtonText: "Price Product",
			searchInputPlaceholder: "Search by name",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Name",
					valueMeta: {
						objectPropertyId: "priceProduct.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true
					}
				},
				{
					displayName: "Room Categories",
					valueMeta: {
						objectPropertyId: "roomCategoriesString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				},
				{
					displayName: "VAT",
					valueMeta: {
						objectPropertyId: "vatTax.value",
						propertyType: TablePropertyType.PercentageType,
						showInCollapsedView: false
					}
				},
				{
					displayName: "Availability",
					valueMeta: {
						objectPropertyId: "availabilityString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				},
				{
					displayName: "Type of Price",
					valueMeta: {
						objectPropertyId: "priceTypeString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				},
				{
					displayName: "Conditions",
					valueMeta: {
						objectPropertyId: "cancellationConditionsString",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false
					}
				}
			]
		}
	}
}