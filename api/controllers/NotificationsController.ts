import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {BedMetaRepoDO, BedSearchResultRepoDO} from '../core/data-layer/notifications/repositories/INotificationsRepository';
import {DeleteBedItem} from '../core/domain-layer/beds/DeleteBedItem';
import {BedDO} from '../core/data-layer/common/data-objects/bed/BedDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../core/data-layer/common/repo-data-objects/LazyLoadRepoDO';

class NotificationsController extends BaseController {
	    
    public getNotificationList(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;
        
        var bedMeta = this.getBedMetaRepoDOFrom(sessionContext);
        
		var bedRepo = appContext.getRepositoryFactory().getBedRepository();
		bedRepo.getBedList(bedMeta, req.body.searchCriteria, req.body.lazyLoad).then((beds: BedSearchResultRepoDO) => {
			this.returnSuccesfulResponse(req, res, beds);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.BedControllerErrorGettingBeds);
		});
	}
    
    public getNotificationListCount(req: Express.Request, res: Express.Response) {
		var appContext: AppContext = req.appContext;
		var sessionContext: SessionContext = req.sessionContext;
        var hotelId: string = sessionContext.sessionDO.hotel.id;

		var notificationsRepo = appContext.getRepositoryFactory().getNotificationsRepository();
		notificationsRepo.getNotificationsListCount(hotelId, req.body.searchCriteria).then((lazyLoadMeta: LazyLoadMetaResponseRepoDO) => {
			this.returnSuccesfulResponse(req, res, lazyLoadMeta);
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.BedsControllerErrorGettingCount);
		});
	}
        
    private getBedMetaRepoDOFrom(sessionContext: SessionContext): BedMetaRepoDO {
		return { hotelId: sessionContext.sessionDO.hotel.id };
	}
}

var notificationsController = new NotificationsController();
module.exports = {
	getNotificationList: notificationsController.getNotificationList.bind(notificationsController),
    getNotificationListCount: notificationsController.getNotificationList.bind(notificationsController)
}