import {AppContext} from '../../../utils/AppContext';
import {INotificationService} from '../INotificationService';
import {NotificationDO} from '../../../data-layer/common/data-objects/notifications/NotificationDO';
import {ThError} from '../../../utils/th-responses/ThError';
import {UnitPalConfig} from '../../../utils/environment/UnitPalConfig';
import {INotificationsRepository} from '../../../data-layer/notifications/repositories/INotificationsRepository';

export class NotificationService implements INotificationService {
	private _notificationsRepo: INotificationsRepository;

    constructor(private _unitPalConfig: UnitPalConfig) {
        var appContext = new AppContext(_unitPalConfig);
		this._notificationsRepo = appContext.getRepositoryFactory().getNotificationsRepository();
	}
		
	public addNotification(notification: NotificationDO): Promise<NotificationDO> {
		return this._notificationsRepo.addNotification(notification);
	}
	
	public getUndeliveredNotifications(hotelId: string): Promise<NotificationDO[]> {
		return this._notificationsRepo.getUndeliveredNotifications(hotelId);
	}
}