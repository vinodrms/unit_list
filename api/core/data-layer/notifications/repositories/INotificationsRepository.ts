import {NotificationDO} from '../../common/data-objects/notifications/NotificationDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

export interface NotificationMetaRepoDO {
    hotelId: string;
    userId: string;
	versionId: number;
}

export interface NotificationSearchCriteriaRepoDO {
	notificationIdList?: string[];
    name?: string;
}

export interface NotificationSearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	notificationList: NotificationDO[];
}


export interface INotificationsRepository {    
	addNotification(notification: NotificationDO): Promise<NotificationDO>;
    
    // Fetches all undelivered notifications for the given hotel id and then
    // marks them as delivered.
    getUndeliveredNotifications(hotelId: string): Promise<NotificationDO[]>;
}