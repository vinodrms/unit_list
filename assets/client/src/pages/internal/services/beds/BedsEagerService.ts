import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';

import {BedTemplatesService} from '../settings/BedTemplatesService';
import {BedTemplateDO} from '../common/data-objects/bed-template/BedTemplateDO';
import {BedTemplatesDO} from '../settings/data-objects/BedTemplatesDO';
import {ARequestService} from '../common/ARequestService';
import {BedsDO} from './data-objects/BedsDO';
import {BedDO} from './data-objects/BedDO';
import {BedVM} from './view-models/BedVM';

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
    
    public getBedAggregatedList(): Observable<BedVM[]> {
        return Observable.combineLatest(
            this.getBedList(),
            this._bedTemplatesService.getBedTemplatesDO()
        ).map((result: [BedsDO, BedTemplatesDO]) => {
            var beds: BedsDO = result[0];
            var bedTemplates: BedTemplatesDO = result[1];
            
            var bedVMList: BedVM[] = [];
            _.forEach(beds.bedList, (bed: BedDO) => {
                var bedVM = new BedVM();
                bedVM.bed = bed;
                bedVM.template = _.find(bedTemplates.bedTemplateList, (bedTemplateDO: BedTemplateDO) => {
                    return bedTemplateDO.id === bed.bedTemplateId;    
                });
                bedVMList.push(bedVM);            
            });
            
            return bedVMList;    
        });    
    }
}