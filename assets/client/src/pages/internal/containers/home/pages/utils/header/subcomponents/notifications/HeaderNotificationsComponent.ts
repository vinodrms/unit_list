import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThError, AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NotificationsModalService} from '../../../notifications/modal/services/NotificationsModalService';
import {NotificationStatsService} from '../../../../../../../services/notifications/NotificationStatsService';
import {NotificationStatsDO} from '../../../../../../../services/notifications/data-objects/NotificationStatsDO';
import {ThNotificationDO} from '../../../../../../../services/notifications/data-objects/ThNotificationDO';

@Component({
	selector: 'header-notifications',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/header/subcomponents/notifications/template/header-notifications.html',
	providers: [NotificationsModalService, NotificationStatsService],
	pipes: [TranslationPipe]
})
export class HeaderNotificationsComponent extends BaseComponent implements OnInit {
	numUnread: number = 0;
	lastNotificationsList: ThNotificationDO[] = [];
	
	constructor(private _appContext: AppContext,
		private _notificationsModalService: NotificationsModalService,
		private _notificationsStatsService: NotificationStatsService) {
		super();
	}

	public ngOnInit() {
		this._notificationsStatsService.getNotificationStatsDO()
			.subscribe((result: NotificationStatsDO) => {
				this.numUnread = result.numUnread;
				this.lastNotificationsList = result.notificationList;
			}, (error: ThError) => {
				this._appContext.toaster.error(this._appContext.thTranslation.translate(error.message));
			});
	}

	public openNotificationsModal(selectedNotification?: any) {
		this._notificationsModalService.openNotificationsModal(selectedNotification).then((modalDialogInstance: ModalDialogRef<any>) => {
			modalDialogInstance.resultObservable.subscribe((shouldRefresh: any) => {
				// refresh
			});
		}).catch((e: any) => { });
	}
}