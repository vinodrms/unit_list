import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { TotalCountDO } from '../common/data-objects/lazy-load/TotalCountDO';
import { AddOnProductCategoryDO } from '../common/data-objects/add-on-product/AddOnProductCategoryDO';
import { AddOnProductCategoriesDO } from '../settings/data-objects/AddOnProductCategoriesDO';
import { AddOnProductCategoriesService } from '../settings/AddOnProductCategoriesService';

@Injectable()
export class AddOnProductsTotalCountService extends ARequestService<TotalCountDO> {
	private _searchCriteria: Object;

	constructor(private _appContext: AppContext,
		private _addOnProductCategoriesService: AddOnProductCategoriesService) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		var searchCriteria = {
			searchCriteria: this._searchCriteria
		};
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.AddOnProductsCount,
			parameters: searchCriteria
		});
	}
	protected parseResult(result: Object): TotalCountDO {
		var countDO = new TotalCountDO();
		countDO.buildFromObject(result);
		return countDO;
	}
	public getTotalCountDO(params: { filterBreakfastCategory: boolean }): Observable<TotalCountDO> {
		return Observable.combineLatest(
			this._addOnProductCategoriesService.getAddOnProductCategoriesDO()
		).flatMap((result: [AddOnProductCategoriesDO]) => {
			this._searchCriteria = this.getSearchCriteria(params.filterBreakfastCategory, result[0]);
			return this.getServiceObservable();
		});
	}
	private getSearchCriteria(filterBreakfastCategory: boolean, addOnProductCategoriesDO: AddOnProductCategoriesDO): Object {
		var breakfastCategory: AddOnProductCategoryDO = addOnProductCategoriesDO.getBreakfastCategory();
		if (filterBreakfastCategory) {
			return { categoryIdList: [breakfastCategory.id] };
		}
		return { notEqualCategoryId: breakfastCategory.id };
	}

	public updateTotalCount() {
		this.updateServiceResult();
	}
}