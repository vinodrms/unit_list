import {Injectable} from 'angular2/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class AddOnProductTableMetaBuilderService {
	constructor() { }
	public buildLazyLoadTableMeta(filterBreakfastCategory: boolean): LazyLoadTableMeta {
		if (filterBreakfastCategory) {
			return this.buildBreakfastLazyLoadTableMeta();
		}
		return this.buildGenericAddOnProductLazyLoadTableMeta();
	}

	private buildBreakfastLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Copy, TableRowCommand.Delete, TableRowCommand.Edit, TableRowCommand.Select, TableRowCommand.Add, TableRowCommand.Search],
			rowIdPropertySelector: "addOnProduct.id",
			addButtonText: "Breakfast",
			searchInputPlaceholder: "Search by name",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Breakfast Name",
					valueMeta: {
						objectPropertyId: "addOnProduct.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true
					}
				},
				{
					displayName: "Price",
					valueMeta: {
						objectPropertyId: "addOnProduct.price",
						propertyType: TablePropertyType.PriceType,
						dependentObjectPropertyId: "ccy.nativeSymbol",
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
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "addOnProduct.notes",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false
					}
				}
			]
		}
	}

	private buildGenericAddOnProductLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Copy, TableRowCommand.Delete, TableRowCommand.Edit, TableRowCommand.Select, TableRowCommand.Add, TableRowCommand.Search],
			rowIdPropertySelector: "addOnProduct.id",
			addButtonText: "Add-On Product",
			searchInputPlaceholder: "Search by name",
			autoSelectRows: false,
			columnMetaList: [
				{
					displayName: "Name",
					valueMeta: {
						objectPropertyId: "addOnProduct.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true
					}
				},
				{
					displayName: "Category",
					valueMeta: {
						objectPropertyId: "category.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false
					}
				},
				{
					displayName: "Price",
					valueMeta: {
						objectPropertyId: "addOnProduct.price",
						propertyType: TablePropertyType.PriceType,
						dependentObjectPropertyId: "ccy.nativeSymbol",
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
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "addOnProduct.notes",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false
					}
				}
			]
		}
	}
}