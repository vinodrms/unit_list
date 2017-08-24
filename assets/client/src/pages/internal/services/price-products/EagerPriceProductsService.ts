import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { PriceProductDO, PriceProductStatus } from './data-objects/PriceProductDO';
import { PriceProductsDO } from './data-objects/PriceProductsDO';

@Injectable()
export class EagerPriceProductsService {
	constructor(private _appContext: AppContext) {
	}

	public getActivePriceProducts(): Observable<PriceProductsDO> {
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.PriceProducts,
			parameters: {
				searchCriteria: { status: PriceProductStatus.Active }
			}
		}).map((resultObject: Object) => {
			var priceProducts = new PriceProductsDO();
			priceProducts.buildFromObject(resultObject);
			return priceProducts;
		});
	}

	public getPriceProducts(priceProductStatus: PriceProductStatus, priceProductIdList: string[]): Observable<PriceProductsDO> {
		if (!priceProductIdList || priceProductIdList.length == 0) {
			return this.getEmptyResult();
		}
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.PriceProducts,
			parameters: {
				searchCriteria: {
					priceProductIdList: priceProductIdList, status: priceProductStatus
				}
			}
		}).map((resultObject: Object) => {
			var priceProducts = new PriceProductsDO();
			priceProducts.buildFromObject(resultObject);
			return priceProducts;
		});
	}
	private getEmptyResult(): Observable<PriceProductsDO> {
		return new Observable<PriceProductsDO>((serviceObserver: Observer<PriceProductsDO>) => {
			var priceProducts = new PriceProductsDO();
			priceProducts.priceProductList = [];
			serviceObserver.next(priceProducts);
			serviceObserver.complete();
		});
	}
}