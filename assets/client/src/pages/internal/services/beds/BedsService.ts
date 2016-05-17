import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';
import {BedsDO} from './data-objects/BedsDO';
import {BedDO} from './data-objects/BedDO';
import {BedVM} from './view-models/BedVM';
import {BedTemplatesService} from '../settings/BedTemplatesService';
import {BedTemplateDO} from '../common/data-objects/bed-template/BedTemplateDO';
import {BedTemplatesDO} from '../settings/data-objects/BedTemplatesDO';

@Injectable()
export class BedsService extends ALazyLoadRequestService<BedVM> {
    
    constructor(appContext: AppContext,
		private _bedTemplatesService: BedTemplatesService) {
		super(appContext, ThServerApi.BedsCount, ThServerApi.Beds);
	}
    
    protected parsePageDataCore(pageDataObject: Object): Observable<BedVM[]> {
		return Observable.combineLatest(
			this._bedTemplatesService.getBedTemplatesDO()
		).map((result: [BedTemplatesDO]) => {
            var bedTemplates = result[0];            
            var beds = new BedsDO();
            beds.buildFromObject(pageDataObject);
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
	public searchByText(text: string) {
		this.updateSearchCriteria({
			name: text
		});
	}
    public saveBedDO(bed: BedDO): Observable<BedDO> {
		return this.runServerPostActionOnBed(ThServerApi.BedsSaveItem, bed);
	}
	public deleteBedDO(bed: BedDO): Observable<BedDO> {
		return this.runServerPostActionOnBed(ThServerApi.BedsDeleteItem, bed);
	}

	private runServerPostActionOnBed(apiAction: ThServerApi, bed: BedDO): Observable<BedDO> {
		return this._appContext.thHttp.post(apiAction, { bed: bed }).map((bedObject: Object) => {
			this.refreshData();

			var updatedBedDO: BedDO = new BedDO();
			updatedBedDO.buildFromObject(bedObject["bed"]);
			return updatedBedDO;
		});
	}
}