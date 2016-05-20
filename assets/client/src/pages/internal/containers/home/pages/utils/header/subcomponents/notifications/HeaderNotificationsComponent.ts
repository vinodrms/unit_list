import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NotificationsModalService} from '../../../notifications/modal/services/NotificationsModalService';

@Component({
	selector: 'header-notifications',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/header/subcomponents/notifications/template/header-notifications.html',
	providers: [NotificationsModalService],
	pipes: [TranslationPipe]
})
export class HeaderNotificationsComponent extends BaseComponent implements OnInit {
	constructor(private _appContext: AppContext,
		private _notificationsModalService: NotificationsModalService) {
		super();
	}

	public ngOnInit() {
		// TODO: get observable
	}

	public openNotificationsModal(selectedNotification?: any) {
		this._notificationsModalService.openNotificationsModal(selectedNotification).then((modalDialogInstance: ModalDialogRef<any>) => {
		}).catch((e: any) => { });
	}
}