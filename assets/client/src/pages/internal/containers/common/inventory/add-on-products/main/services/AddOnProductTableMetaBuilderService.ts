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
						showInCollapsedView: true,
						normalStyle: "up-col-35p left",
						collapsedStyle: "up-col-70p left"
					}
				},
				{
					displayName: "Price",
					valueMeta: {
						objectPropertyId: "addOnProduct.price",
						propertyType: TablePropertyType.PriceType,
						dependentObjectPropertyId: "ccy.nativeSymbol",
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "VAT",
					valueMeta: {
						objectPropertyId: "vatTax.value",
						propertyType: TablePropertyType.PercentageType,
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "addOnProduct.notes",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-35p left"
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
						showInCollapsedView: true,
						normalStyle: "up-col-25p left",
						collapsedStyle: "up-col-70p left"
					}
				},
				{
					displayName: "Category",
					valueMeta: {
						objectPropertyId: "category.name",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-25p center"
					}
				},
				{
					displayName: "Price",
					valueMeta: {
						objectPropertyId: "addOnProduct.price",
						propertyType: TablePropertyType.PriceType,
						dependentObjectPropertyId: "ccy.nativeSymbol",
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "VAT",
					valueMeta: {
						objectPropertyId: "vatTax.value",
						propertyType: TablePropertyType.PercentageType,
						showInCollapsedView: false,
						normalStyle: "up-col-10p center"
					}
				},
				{
					displayName: "Notes",
					valueMeta: {
						objectPropertyId: "addOnProduct.notes",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-20p center"
					}
				}
			]
		}
	}
}