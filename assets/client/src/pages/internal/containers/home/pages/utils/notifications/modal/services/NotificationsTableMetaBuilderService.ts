import {Injectable} from '@angular/core';
import {LazyLoadTableMeta, TableRowCommand, TableColumnMeta, TablePropertyType} from '../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Injectable()
export class NotificationsTableMetaBuilderService {
	constructor() { }

	public buildLazyLoadTableMeta(): LazyLoadTableMeta {
		return {
			supportedRowCommandList: [TableRowCommand.Select],
			rowIdPropertySelector: "notification.id",
			autoSelectRows: true,
			columnMetaList: [
				{
					displayName: "Message",
					valueMeta: {
						objectPropertyId: "translatedMessage",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: true,
						normalStyle: "up-col-70p left",
						collapsedStyle: "up-col-70p left"
					}
				},
			]
		}
	}
}