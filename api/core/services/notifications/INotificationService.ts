import {NotificationDO} from '../../data-layer/common/data-objects/notifications/NotificationDO';
import {NotificationRepoDO} from '../../data-layer/notifications/repositories/INotificationsRepository';

export interface INotificationService {
	/**
	 * Adds the given notification to the database and marks it as undelivered.
	 */
	addNotification(notification: NotificationDO): Promise<NotificationDO>;
	
	/**
	 * Returns all undelivered notifications with the given meta. All returned
	 * notifications are afterwards marked as delivered. The notifications are
	 * returned from the most recent to the least recent (i.e., with decreasing
	 * timestamp order).
	 */
	getUndeliveredNotifications(meta: NotificationRepoDO.Meta): Promise<NotificationDO[]>;
}