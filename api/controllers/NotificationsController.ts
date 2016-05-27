import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {NotificationRepoDO} from '../core/data-layer/notifications/repositories/INotificationsRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';
import {ThNotification} from '../core/services/notifications/ThNotification';

class NotificationsController extends BaseController {
	    
    public getNotificationList(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;

        var meta = this.getNotificationsMetaFrom(sessionContext);        
		var notificationsRepo = appContext.getRepositoryFactory().getNotificationsRepository();
		
		notificationsRepo.getNotificationList(meta, req.body.searchCriteria, req.body.lazyLoad).then((searchResult: NotificationRepoDO.SearchResult) => {
			this.returnSuccesfulResponse(req, res, {
				notificationList: ThNotification.buildThNotificationList(searchResult.notificationList, sessionContext.language),
        		lazyLoad: searchResult.lazyLoad
			});
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.NotificationsRepositoryErrorGettingList);
		});
	}
    
    public getNotificationListCount(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;
		
        var meta = this.getNotificationsMetaFrom(sessionContext);
		var notificationsRepo = appContext.getRepositoryFactory().getNotificationsRepository();
		
		notificationsRepo.getNotificationsListCount(meta, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
			this.returnSuccesfulResponse(req, res, lazyLoadMeta);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.NotificationsRepositoryErrorGettingCount);
		});
	}
    
	public markNotificationsAsRead(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;
	
		var meta = this.getNotificationsMetaFrom(sessionContext);
		var notificationsRepo = appContext.getRepositoryFactory().getNotificationsRepository();
		
		notificationsRepo.markNotificationsAsRead(meta, req.body.searchCriteria).then((numUpdated: number) => {
			this.returnSuccesfulResponse(req, res, numUpdated);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.NotificationsRepositoryErrorMarkingAsRead);
		});
	}
	
    private getNotificationsMetaFrom(sessionContext: SessionContext): NotificationRepoDO.Meta {
		return { hotelId: sessionContext.sessionDO.hotel.id };
	}
}

var notificationsController = new NotificationsController();
module.exports = {
	getNotificationList: notificationsController.getNotificationList.bind(notificationsController),
    getNotificationListCount: notificationsController.getNotificationListCount.bind(notificationsController),
	markNotificationsAsRead: notificationsController.markNotificationsAsRead.bind(notificationsController)
}