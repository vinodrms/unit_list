import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ALazyLoadRequestService } from '../common/ALazyLoadRequestService';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { NotificationStatsDO } from './data-objects/NotificationStatsDO';
import { ThNotificationDO } from './data-objects/ThNotificationDO';
import { TotalCountDO } from '../common/data-objects/lazy-load/TotalCountDO';

@Injectable()
export class NotificationService extends ALazyLoadRequestService<ThNotificationDO> {
    private static NUM_LAST_ITEMS = 5;

    constructor(appContext: AppContext) {
        super(appContext, ThServerApi.NotificationsCount, ThServerApi.Notifications);
        this.defaultSearchCriteria = {};
    }

    protected parsePageDataCore(pageDataObject: Object): Observable<ThNotificationDO[]> {
        return new Observable<ThNotificationDO[]>((serviceObserver: Observer<ThNotificationDO[]>) => {
            var notificationStats = new NotificationStatsDO();
            notificationStats.buildFromObject(pageDataObject);
            var result: ThNotificationDO[] = notificationStats.notificationList;

            serviceObserver.next(result);
            serviceObserver.complete();
        });
    }

    public searchByText(text: string) {
        // Nothing to do: notifications cannot be searched by text.
    }

    public setSearchCriteria(searchCriteria: Object) {
        this.defaultSearchCriteria = searchCriteria;
    }

    public markNotificationsAsRead(searchCriteria: any): Observable<number> {
        var params = { searchCriteria: searchCriteria };
        return this._appContext.thHttp.post({
            serverApi: ThServerApi.NotificationsMarkAsRead,
            parameters: params
        }).map((numUpdatedObj: Object) => {
            return <number>numUpdatedObj;
        });
    }
}