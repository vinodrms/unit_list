import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { BedTemplatesDO } from './data-objects/BedTemplatesDO';

@Injectable()
export class BedTemplatesService extends ARequestService<BedTemplatesDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get({
			serverApi: ThServerApi.SettingsBedTemplates
		});
	}
	protected parseResult(result: Object): BedTemplatesDO {
		var bedTemplatesDO: BedTemplatesDO = new BedTemplatesDO();
		bedTemplatesDO.buildFromObject(result);
		return bedTemplatesDO;
	}
	public getBedTemplatesDO(): Observable<BedTemplatesDO> {
		return this.getServiceObservable();
	}
}