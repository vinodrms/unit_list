import {Injectable, ReflectiveInjector} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NotificationsModalInput} from './utils/NotificationsModalInput';
import {NotificationsModalComponent} from '../NotificationsModalComponent';
import {NotificationsModalModule} from '../NotificationsModalModule';
import {ThNotificationDO} from '../../../../../../../services/notifications/data-objects/ThNotificationDO';

@Injectable()
export class NotificationsModalService {

	constructor(private _appContext: AppContext) { }

	public openNotificationsModal(preselectedNotification?: ThNotificationDO): Promise<ModalDialogRef<boolean>> {
		var modalInput = new NotificationsModalInput();
		modalInput.preselectedNotification = preselectedNotification;

		return this._appContext.modalService.open<any>(NotificationsModalModule, NotificationsModalComponent, ReflectiveInjector.resolve([
			{ provide: NotificationsModalInput, useValue: modalInput }
		]));
	}
}