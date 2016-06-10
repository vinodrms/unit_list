import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThTimestampDistanceFromNowPipe} from '../../../../../../../../../common/utils/pipes/ThTimestampDistanceFromNowPipe';
import {ThError, AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NotificationsModalService} from '../../../notifications/modal/services/NotificationsModalService';
import {NotificationStatsService} from '../../../../../../../services/notifications/NotificationStatsService';
import {NotificationStatsDO} from '../../../../../../../services/notifications/data-objects/NotificationStatsDO';
import {ThNotificationDO} from '../../../../../../../services/notifications/data-objects/ThNotificationDO';
import {ISocketsService} from '../../../../../../../../../common/utils/sockets/ISocketsService';
import {SocketMessage} from '../../../../../../../../../common/utils/sockets/utils/SocketMessage';

@Component({
	selector: 'header-notifications',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/header/subcomponents/notifications/template/header-notifications.html',
	providers: [NotificationsModalService, NotificationStatsService],
	pipes: [TranslationPipe, ThTimestampDistanceFromNowPipe]
})
export class HeaderNotificationsComponent extends BaseComponent implements OnInit, OnDestroy {
	numUnread: number = 0;
	lastNotificationsList: ThNotificationDO[] = [];
	
	newNotificationsSubscription: Subscription;

	constructor(private _appContext: AppContext,
		private _notificationsModalService: NotificationsModalService,
		private _notificationsStatsService: NotificationStatsService,
		@Inject(ISocketsService) private _socketsService: ISocketsService) {
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
		this.newNotificationsSubscription = this._socketsService.getObservable('NewNotification').subscribe((message: SocketMessage) => {
            this._notificationsStatsService.refreshData();
			this._appContext.toaster.info(message.content);
		});
	}

	public openNotificationsModal(selectedNotification?: any) {
		this._notificationsModalService.openNotificationsModal(selectedNotification).then((modalDialogInstance: ModalDialogRef<any>) => {
			modalDialogInstance.resultObservable.subscribe((shouldRefresh: any) => {
				this._notificationsStatsService.refreshData();
			});
		}).catch((e: any) => { });
	}

	public ngOnDestroy() {
		this.newNotificationsSubscription.unsubscribe();
	}
}