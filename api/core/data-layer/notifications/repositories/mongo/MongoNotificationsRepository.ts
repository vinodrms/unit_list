import {INotificationsRepository} from '../INotificationsRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {MongoQueryBuilder} from '../../../common/base/MongoQueryBuilder';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../common/base/MongoRepository';
import {NotificationDO} from '../../../common/data-objects/notifications/NotificationDO';
import {NotificationRepoDO} from '../INotificationsRepository';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';

import _ = require('underscore');

export class MongoNotificationsRepository extends MongoRepository implements INotificationsRepository {
	constructor() {
		super(sails.models.notificationsentity);
	}
	
	public addNotification(notification: NotificationDO): Promise<NotificationDO> {
    	return new Promise<NotificationDO>((resolve: { (result: NotificationDO): void }, reject: { (err: ThError): void }) => {
            this.addNotificationCore(notification, resolve, reject);
        });
    }
    private addNotificationCore(
        notification: NotificationDO, 
        resolve: { (result: NotificationDO): void }, 
        reject: { (err: ThError): void }) {
        
        notification.delivered = false;        
		this.createDocument(notification,
			(err: Error) => {
				var errorCode = this.getMongoErrorCode(err);
                var thError = new ThError(ThStatusCode.NotificationsRepositoryErrorAddingNotification, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding notification", notification, thError);
                reject(thError);
			},
			(createdNotification: Object) => {
				var savedNotification = new NotificationDO();
				savedNotification.buildFromObject(createdNotification);
				resolve(savedNotification);
			}
		);
    }
    
    public getNotificationsListCount(meta: NotificationRepoDO.Meta, searchCriteria?: NotificationRepoDO.SearchCriteria): Promise<LazyLoadMetaResponseRepoDO> {
        return new Promise<LazyLoadMetaResponseRepoDO>((resolve: { (meta: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getNotificationsListCountCore(resolve, reject, meta, searchCriteria);
        });
    }
    private getNotificationsListCountCore(
        resolve: { (meta: LazyLoadMetaResponseRepoDO): void }, 
        reject: { (err: ThError): void }, 
        meta: NotificationRepoDO.Meta, 
        searchCriteria?: NotificationRepoDO.SearchCriteria) {
            
        var searchQuery = this.getSearchQuery(meta, searchCriteria);
        this.getDocumentCount(searchQuery,
            (err: Error) => {
				var errorCode = this.getMongoErrorCode(err);
                var thError = new ThError(ThStatusCode.NotificationsRepositoryErrorGettingCount, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting count",  { meta: meta, searchCriteria: searchCriteria }, thError);
                reject(thError);
			},
			(meta: LazyLoadMetaResponseRepoDO) => {
				resolve(meta);
			}
		);
    }
    
    public getNotificationList(meta: NotificationRepoDO.Meta, searchCriteria?: NotificationRepoDO.SearchCriteria, lazyLoad?: LazyLoadRepoDO): Promise<NotificationRepoDO.SearchResult> {
        return new Promise<NotificationRepoDO.SearchResult>((resolve: {(searchResult: NotificationRepoDO.SearchResult): void}, reject: { (err: ThError): void }) => {
            this.getNotificationListCore(resolve, reject, meta, searchCriteria, lazyLoad);
        });
    }
    private getNotificationListCore(
        resolve: {(searchResult: NotificationRepoDO.SearchResult): void}, 
        reject: { (err: ThError): void }, 
        meta: NotificationRepoDO.Meta,
        searchCriteria?: NotificationRepoDO.SearchCriteria, 
        lazyLoad?: LazyLoadRepoDO) {

        var searchQuery = this.getSearchQuery(meta, searchCriteria);
        // Always sort from the most recent (largest timestamp) to the least 
        // recent (smallest timestamp).
        var sortCriteria = {timestamp: 1};
        this.findMultipleDocuments({ criteria: searchQuery, sortCriteria: sortCriteria, lazyLoad: lazyLoad },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.NotificationsRepositoryErrorGettingList, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting notifications list.", meta, thError);
                reject(thError);
            },
            (dbNotificationsList: Array<Object>) => {
                var resultDO = this.getQueryResult(NotificationDO, dbNotificationsList);
                resolve({
                    notificationList: resultDO,
                    lazyLoad: lazyLoad
                });
            }
        );
    }
    
    public getUndeliveredNotifications(meta: NotificationRepoDO.Meta): Promise<NotificationDO[]> {
        return new Promise<NotificationDO[]>((resolve: { (result: NotificationDO[]): void }, reject: { (err: ThError): void }) => {
            this.getUndeliveredNotificationsCore(resolve, reject, meta);
        });
    }
	private getUndeliveredNotificationsCore(resolve: { (result: NotificationDO[]): void }, reject: { (err: ThError): void }, meta: NotificationRepoDO.Meta) {
    	var notificationList: NotificationDO[] = [];
        this.readUndeliveredNotifications(meta)
            .then((readNotificationList: NotificationDO[]) => {
                notificationList = readNotificationList;
                return this.markNotificationsAsDelivered(readNotificationList);
            }).then(() => {
                resolve(notificationList);
            }).catch((err: any) => {
                reject(err);    
            });
	}
    
    private readUndeliveredNotifications(meta: NotificationRepoDO.Meta): Promise<NotificationDO[]> {
        return new Promise<NotificationDO[]>((resolve: { (result: NotificationDO[]): void }, reject: { (err: ThError): void }) => {
            this.readUndeliveredNotificationsCore(resolve, reject, meta); 
        });
    }
    private readUndeliveredNotificationsCore(resolve: { (result: NotificationDO[]) : void }, reject: { (err: ThError) : void }, meta: NotificationRepoDO.Meta) {
        var mongoQueryBuilder = new MongoQueryBuilder();
        mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
		mongoQueryBuilder.addExactMatch("delivered", false);
		        
        var mongoSearchCriteria: MongoSearchCriteria = {
			criteria: mongoQueryBuilder.processedQuery,
			sortCriteria: { timestamp: -1 }
		};

        this.findMultipleDocuments(mongoSearchCriteria,
            (err: Error) => {
				var thError = new ThError(ThStatusCode.NotificationsRepositoryErrorGettingUndelivered, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting the undelivered notifications", mongoSearchCriteria, thError);
				reject(thError);
			},
			(documentList: Object[]) => {
                var notificationList: NotificationDO[] = _.map(documentList, (document: Object) => {
                    var notification = new NotificationDO();
		            notification.buildFromObject(document);
                    return notification;
                });
		        resolve(notificationList);
			});
    }
    
    private markNotificationsAsDelivered(notificationList: NotificationDO[]): Promise<number> {
        return new Promise<number>((resolve: { (): void }, reject: { (err: ThError): void }) => {
            this.markNotificationsAsDeliveredCore(resolve, reject, notificationList);
        });
    }
    private markNotificationsAsDeliveredCore(resolve: { (): void }, reject: { (err: ThError): void }, notifications: NotificationDO[]) {
        var idList: string[] = _.map(notifications, (notification: NotificationDO) => { return notification.id });

        var findQueryBuilder = new MongoQueryBuilder();
        findQueryBuilder.addMultipleSelectOptionList("id", idList);
        var searchQuery = findQueryBuilder.processedQuery;
      	var updateQuery = { "delivered": true };

         this.updateMultipleDocuments(searchQuery,
            updateQuery,
            (err: Error) => {
				reject(this.getWrappedAndLogUndeliveredError(searchQuery, err));
			},
            (numUpdated: number) => {
                if (numUpdated < notifications.length) {
                    reject(this.getWrappedAndLogUndeliveredError(searchQuery, new Error("Couldn't update all entries")));
                } else {
                    resolve();
                }
            });
    }
    
    private getWrappedAndLogUndeliveredError(searchQuery: Object, cause: Error) {
        var thError = new ThError(ThStatusCode.NotificationsRepositoryErrorGettingUndelivered, cause);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating undelivered notifications", searchQuery, thError);
        return thError;
    }
    
    private getSearchQuery(meta: NotificationRepoDO.Meta, searchCriteria: NotificationRepoDO.SearchCriteria): Object {
        var mongoQueryBuilder = new MongoQueryBuilder();
        mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
        mongoQueryBuilder.addExactMatch("read", searchCriteria.read);
        return mongoQueryBuilder.processedQuery;
    }
}