import {ThNotificationDO} from '../../../../../../../../services/notifications/data-objects/ThNotificationDO';

export class NotificationsModalInput {
	private _preselectedNotification: ThNotificationDO;
	public get preselectedNotification(): ThNotificationDO {
		return this._preselectedNotification;
	}
	public set preselectedNotification(preselectedNotification: ThNotificationDO) {
		this._preselectedNotification = preselectedNotification;
	}
}