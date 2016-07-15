import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ARequestService} from '../../common/ARequestService';
import {AppContext, ThServerApi} from '../../../../../common/utils/AppContext';
import {ThTimestampDO} from '../../common/data-objects/th-dates/ThTimestampDO';

@Injectable()
export class HotelTimeService extends ARequestService<ThTimestampDO> {

    constructor(private _appContext: AppContext) {
        super();
    }

    protected sendRequest(): Observable<Object> {
        return this._appContext.thHttp.get(ThServerApi.HotelOperationsCommonHotelTimestamp);
    }

    protected parseResult(result: Object): ThTimestampDO {
        var currentHotelTimestamp = new ThTimestampDO();
        currentHotelTimestamp.buildFromObject(result["timestamp"]);
        return currentHotelTimestamp;
    }

    public getCurrentHotelTimestamp(): Observable<ThTimestampDO> {
        return this.getServiceObservable();
    }
}