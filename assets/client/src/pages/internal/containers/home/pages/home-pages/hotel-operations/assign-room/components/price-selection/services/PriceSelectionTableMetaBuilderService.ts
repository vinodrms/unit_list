import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TablePropertyType} from '../../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class PriceSelectionTableMetaBuilderService {

    constructor() { }
    public buildLazyLoadTableMeta(): LazyLoadTableMeta {
        return {
            supportedRowCommandList: [TableRowCommand.Select],
            rowIdPropertySelector: "roomCategoryStats.roomCategory.id",
            autoSelectRows: false,
            columnMetaList: [
                {
                    displayName: "Room Category",
                    valueMeta: {
                        objectPropertyId: "roomCategoryName",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: true,
                        normalStyle: "up-col-30p left",
                        collapsedStyle: "up-col-70p left"
                    }
                },
                {
                    displayName: "Price",
                    valueMeta: {
                        objectPropertyId: "priceText",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-30p center"
                    }
                },
                {
                    displayName: "",
                    valueMeta: {
                        objectPropertyId: "description",
                        propertyType: TablePropertyType.StringType,
                        showInCollapsedView: false,
                        normalStyle: "up-col-35p left"
                    }
                }
            ]
        }
    }
}