import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {AddOnProductsDO} from './data-objects/AddOnProductsDO';

@Injectable()
export class EagerAddOnProductsService {
	constructor(private _appContext: AppContext) {
	}

	public getAddOnProductsById(addOnProductIdList: string[]): Observable<AddOnProductsDO> {
		if (!addOnProductIdList || addOnProductIdList.length == 0) {
			return this.getEmptyResult();
		}
		return this._appContext.thHttp.post(ThServerApi.AddOnProducts, { searchCriteria: { addOnProductIdList: addOnProductIdList } }).map((resultObject: Object) => {
			var addOnProducts = new AddOnProductsDO();
			addOnProducts.buildFromObject(resultObject);
			return addOnProducts;
		});
	}
	private getEmptyResult(): Observable<AddOnProductsDO> {
		return new Observable<AddOnProductsDO>((serviceObserver: Observer<AddOnProductsDO>) => {
			var addOnProducts = new AddOnProductsDO();
			addOnProducts.addOnProductList = [];
			serviceObserver.next(addOnProducts);
			serviceObserver.complete();
		});
	}
}