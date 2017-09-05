import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { TimezoneResponseDO } from './data-objects/TimezoneResponseDO';

@Injectable()
export class TimezoneService extends ARequestService<TimezoneResponseDO> {
    constructor(private _appContext: AppContext) {
        super();
    }
    protected sendRequest(): Observable<Object> {
        return this._appContext.thHttp.get({
            serverApi: ThServerApi.ServiceTimezones
        });
    }
    protected parseResult(result: Object): TimezoneResponseDO {
        var timezoneResponseDO: TimezoneResponseDO = new TimezoneResponseDO();
        timezoneResponseDO.buildFromObject(result);
        return timezoneResponseDO;
    }
    public getTimezoneResponseDO(): Observable<TimezoneResponseDO> {
        return this.getServiceObservable();
    }
}