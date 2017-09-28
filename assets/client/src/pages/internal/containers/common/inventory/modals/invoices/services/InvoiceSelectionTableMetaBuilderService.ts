import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class InvoiceSelectionTableMetaBuilderService {
	constructor() { }
	public buildLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Select, TableRowCommand.Search],
			rowIdPropertySelector: "invoice.id",
			addButtonText: "Invoice",
			searchInputPlaceholder: "Search by reference",
			autoSelectRows: false,
			columnMetaList: [
				{
                    displayName: "Reference",
                    valueMeta: {
                        objectPropertyId: "invoice.reference",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: true,
                        normalStyle: "up-col-40p left",
                        collapsedStyle: "up-col-70p left"
                    }
                },
                {
                    displayName: "Status",
                    valueMeta: {
                        objectPropertyId: "invoiceMeta.displayName",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-20p center"
                    }
                },
                {
                    displayName: "Customers",
                    valueMeta: {
                        objectPropertyId: "payerListString",
                        propertyType: TablePropertyType.NotesType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-40p center"
                    }
                },
            ]
		}
	}
}
