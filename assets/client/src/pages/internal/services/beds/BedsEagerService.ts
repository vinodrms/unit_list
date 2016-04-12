import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';

import {BedTemplatesService} from '../settings/BedTemplatesService';
import {BedTemplateDO} from '../common/data-objects/bed-template/BedTemplateDO';
import {BedTemplatesDO} from '../settings/data-objects/BedTemplatesDO';
import {ARequestService} from '../common/ARequestService';
import {BedVM} from './view-models/BedVM';
import {BedsDO} from './data-objects/BedsDO';
import {BedDO} from './data-objects/BedDO';

@Injectable()
export class BedsEagerService extends ARequestService<BedsDO> {

    constructor(private _appContext: AppContext,
        private _bedTemplatesService: BedTemplatesService) {
            super();
    }

    protected sendRequest(): Observable<Object> {
        return this._appContext.thHttp.post(ThServerApi.Beds, {});
    }
    
    protected parseResult(result: Object): BedsDO {
		var beds = new BedsDO();
        beds.buildFromObject(result);
		return beds;
	}
    
    public getBedList(): Observable<BedsDO> {
        return this.getServiceObservable();
    }
}