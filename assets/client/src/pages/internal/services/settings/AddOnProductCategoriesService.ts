import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { AddOnProductCategoriesDO } from './data-objects/AddOnProductCategoriesDO';

@Injectable()
export class AddOnProductCategoriesService extends ARequestService<AddOnProductCategoriesDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get({ 
			serverApi: ThServerApi.SettingsAddOnProductCategories 
		});
	}
	protected parseResult(result: Object): AddOnProductCategoriesDO {
		var aopCategsDO: AddOnProductCategoriesDO = new AddOnProductCategoriesDO();
		aopCategsDO.buildFromObject(result);
		return aopCategsDO;
	}
	public getAddOnProductCategoriesDO(): Observable<AddOnProductCategoriesDO> {
		return this.getServiceObservable();
	}
}