import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NotificationStatsDO } from './data-objects/NotificationStatsDO';
import { ThNotificationDO } from './data-objects/ThNotificationDO';
import { TotalCountDO } from '../common/data-objects/lazy-load/TotalCountDO';

import * as _ from "underscore";

@Injectable()
export class NotificationStatsService extends ARequestService<NotificationStatsDO> {
    private static NUM_LAST_ITEMS = 5;

    constructor(private _appContext: AppContext) {
        super();
    }

    public getNotificationStatsDO(): Observable<NotificationStatsDO> {
        return this.getServiceObservable();
    }

    protected sendRequest(): Observable<Object> {
        return Observable.combineLatest(
            this.getUnreadNotificationsCountDO(),
            this.getLastNotificationsDO(NotificationStatsService.NUM_LAST_ITEMS)
        ).map((result: [TotalCountDO, ThNotificationDO[]]) => {
            var notificationStatsDO = new NotificationStatsDO();
            notificationStatsDO.numUnread = result[0].numOfItems;
            notificationStatsDO.notificationList = result[1];
            return notificationStatsDO;
        });
    }

    private getUnreadNotificationsCountDO(): Observable<TotalCountDO> {
        var params = { searchCriteria: { read: false } };
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.NotificationsCount,
            parameters: params
        }).map((result: Object) => {
            var totalCountDO = new TotalCountDO();
            totalCountDO.buildFromObject(result);
            return totalCountDO;
        });
    }

    private getLastNotificationsDO(numItems: number): Observable<ThNotificationDO[]> {
        var requestParams = { searchCriteria: {}, lazyLoad: { pageNumber: 0, pageSize: numItems } };
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.Notifications,
            parameters: requestParams
        }).map((result: Object) => {
            var notificationObjList = result["notificationList"];
            if (!notificationObjList || !_.isArray(notificationObjList)) {
                return [];
            }

            var notificationList: ThNotificationDO[] = [];
            notificationObjList.forEach((notificationObj: Object) => {
                var notificationDO = new ThNotificationDO();
                notificationDO.buildFromObject(notificationObj);
                notificationList.push(notificationDO);
            });
            return notificationList;
        });
    }

    protected parseResult(result: Object): NotificationStatsDO {
        return <NotificationStatsDO>result;
    }

    public refreshData() {
        this.updateServiceResult();
    }
}