import {Injectable, ReflectiveInjector, provide} from '@angular/core';
import {AppContext} from '../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NotificationsModalInput} from './utils/NotificationsModalInput';
import {NotificationsModalComponent} from '../NotificationsModalComponent';

@Injectable()
export class NotificationsModalService {

	constructor(private _appContext: AppContext) { }

	public openNotificationsModal(preselectedNotification?: any): Promise<ModalDialogRef<any>> {
		var modalInput = new NotificationsModalInput();
		modalInput.preselectedNotification = preselectedNotification;

		return this._appContext.modalService.open<any>(<any>NotificationsModalComponent, ReflectiveInjector.resolve([
			provide(NotificationsModalInput, { useValue: modalInput })
		]));
	}
}