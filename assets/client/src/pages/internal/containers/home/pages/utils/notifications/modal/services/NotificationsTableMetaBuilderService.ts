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
					displayName: "Date",
					valueMeta: {
						objectPropertyId: "thTimestampString",
						propertyType: TablePropertyType.StringType,
						showInCollapsedView: false,
						normalStyle: "up-col-15p left"
					}
				},
				{
					displayName: "Message",
					valueMeta: {
						objectPropertyId: "translatedMessage",
						propertyType: TablePropertyType.NotesType,
						showInCollapsedView: true,
						normalStyle: "up-col-85p left",
						collapsedStyle: "up-col-70p left"
					}
				},
			]
		}
	}
}