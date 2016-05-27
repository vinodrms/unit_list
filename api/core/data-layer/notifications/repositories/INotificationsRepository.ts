import {NotificationDO} from '../../common/data-objects/notifications/NotificationDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

export module NotificationRepoDO {
    export interface Meta  {
        hotelId: string;
    }
    
    export interface SearchCriteria {
        read?: boolean;
        notificationId?: string; 
    }
    
    export interface SearchResult {
        notificationList: NotificationDO[];
        lazyLoad?: LazyLoadRepoDO;
    }
}

export interface INotificationsRepository {
	addNotification(notification: NotificationDO): Promise<NotificationDO>;

    getNotificationsListCount(
        meta: NotificationRepoDO.Meta,
        searchCriteria?: NotificationRepoDO.SearchCriteria): Promise<LazyLoadMetaResponseRepoDO>;
        
    getNotificationList(
        meta: NotificationRepoDO.Meta,
        searchCriteria?: NotificationRepoDO.SearchCriteria,
        lazyLoad?: LazyLoadRepoDO): Promise<NotificationRepoDO.SearchResult>;
    
    // Marks all notifications satisfying the SearchCriteria as read. Returns a Promise
    // with the number of updated notifications.
    markNotificationsAsRead(
        meta: NotificationRepoDO.Meta,
        searchCriteria: NotificationRepoDO.SearchCriteria): Promise<number>;
    
    // Fetches all undelivered notifications for the given hotel id and then
    // marks them as delivered.
    getUndeliveredNotifications(meta: NotificationRepoDO.Meta): Promise<NotificationDO[]>;
}