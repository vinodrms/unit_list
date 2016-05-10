import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {TotalCountDO} from '../common/data-objects/lazy-load/TotalCountDO';
import {AddOnProductCategoryDO} from '../common/data-objects/add-on-product/AddOnProductCategoryDO';

@Injectable()
export class AddOnProductsTotalCountService extends ARequestService<TotalCountDO> {
	private _addOnProductCategory: AddOnProductCategoryDO;
	
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		var searchCriteria = {};
		if(this._addOnProductCategory && this._addOnProductCategory.id) {
			searchCriteria = {
				searchCriteria: {
					categoryIdList: [ this._addOnProductCategory.id ]
				}
			}
		};
		return this._appContext.thHttp.post(ThServerApi.AddOnProductsCount, searchCriteria);
	}
	protected parseResult(result: Object): TotalCountDO {
		var countDO = new TotalCountDO();
		countDO.buildFromObject(result);
		return countDO;
	}
	public getTotalCountDO(addOnProductCategory?: AddOnProductCategoryDO): Observable<TotalCountDO> {
		this._addOnProductCategory = addOnProductCategory;
		return this.getServiceObservable();
	}
	public updateTotalCount() {
		this.updateServiceResult();
	}
}