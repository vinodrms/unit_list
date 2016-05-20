import {NotificationDO} from '../../data-layer/common/data-objects/notifications/NotificationDO';

export interface INotificationService {
	/**
	 * Adds the given notification to the database and marks it as undelivered.
	 */
	addNotification(notification: NotificationDO): Promise<NotificationDO>;
	
	/**
	 * Returns all undelivered notifications for the given hotel. All returned
	 * notifications are afterwards marked as delivered. The notifications are
	 * returned from the most recent to the least recent (i.e., with decreasing
	 * timestamp order).
	 */
	getUndeliveredNotifications(hotelId: string): Promise<NotificationDO[]>;
}