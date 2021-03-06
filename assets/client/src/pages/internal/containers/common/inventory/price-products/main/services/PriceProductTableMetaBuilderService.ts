import { Injectable } from '@angular/core';
import { LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType } from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

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
						showInCollapsedView: true,
						normalStyle: "up-col-10p left",
						collapsedStyle: "up-col-70p left"
					}
				},
				{
					displayName: "Related To",
					valueMeta: {
						objectPropertyId: "parentPriceProductName",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-10p center",
					}
				},
				{
					displayName: "Room Categories",
					valueMeta: {
						objectPropertyId: "roomCategoriesString",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p left"
					}
				},
				{
					displayName: "Price Brief",
					valueMeta: {
						objectPropertyId: "priceBrief",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center"
					}
				},
				{
					displayName: "Type of Price",
					valueMeta: {
						objectPropertyId: "priceTypeString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center"
					}
				},
				{
					displayName: "Availability",
					valueMeta: {
						objectPropertyId: "availabilityString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center"
					}
				},
				{
					displayName: "Conditions",
					valueMeta: {
						objectPropertyId: "cancellationConditionsString",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p center"
					}
				}
			]
		}
	}
}