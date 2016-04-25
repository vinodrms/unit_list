import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';
import {TaxService} from '../taxes/TaxService';
import {TaxContainerDO} from '../taxes/data-objects/TaxContainerDO';
import {RoomCategoriesService} from '../room-categories/RoomCategoriesService';
import {RoomCategoryDO} from '../room-categories/data-objects/RoomCategoryDO';
import {YieldFiltersService} from '../hotel-configurations/YieldFiltersService';
import {YieldFiltersDO} from '../hotel-configurations/data-objects/YieldFiltersDO';

import {PriceProductsDO} from './data-objects/PriceProductsDO';
import {PriceProductDO, PriceProductStatus, PriceProductAvailability} from './data-objects/PriceProductDO';
import {PriceProductVM} from './view-models/PriceProductVM';

@Injectable()
export class PriceProductsService extends ALazyLoadRequestService<PriceProductVM> {
	constructor(appContext: AppContext,
		private _taxService: TaxService,
		private _roomCategoriesService: RoomCategoriesService,
		private _yieldFiltersService: YieldFiltersService) {
		super(appContext, ThServerApi.PriceProductsCount, ThServerApi.PriceProducts);
		this.defaultSearchCriteria = { status: PriceProductStatus.Active };
	}

	protected parsePageDataCore(pageDataObject: Object): Observable<PriceProductVM[]> {
		this._appContext.thTranslation
		return Observable.combineLatest(
			this._taxService.getTaxContainerDO(),
			this._roomCategoriesService.getRoomCategoryList(),
			this._yieldFiltersService.getYieldFiltersDO()
		).map((result: [TaxContainerDO, RoomCategoryDO[], YieldFiltersDO]) => {
			var taxContainer: TaxContainerDO = result[0];
			var roomCategoryList: RoomCategoryDO[] = result[1];
			var yieldFilters: YieldFiltersDO = result[2];

			var priceProducts = new PriceProductsDO();
			priceProducts.buildFromObject(pageDataObject);

			var priceProductVMList: PriceProductVM[] = [];
			_.forEach(priceProducts.priceProductList, (priceProductDO: PriceProductDO) => {
				var priceProductVM = new PriceProductVM(this._appContext.thTranslation);
				priceProductVM.priceProduct = priceProductDO;
				priceProductVM.initFromTaxes(taxContainer);
				priceProductVM.initFromRoomCategoryList(roomCategoryList);
				priceProductVM.initFromYieldFilters(yieldFilters);

				priceProductVMList.push(priceProductVM);
			});
			return priceProductVMList;
		});
	}
	public searchByText(text: string) {
		this.updateSearchCriteria({
			name: text
		});
	}
	public setStatusFilter(status: PriceProductStatus) {
		this.defaultSearchCriteria = {
			status: status
		}
	}
	public setAvailabilityFilter(availability: PriceProductAvailability) {
		this.defaultSearchCriteria["availability"] = availability; 
	}

	public savePriceProductDO(priceProduct: PriceProductDO): Observable<PriceProductDO> {
		return this.runServerPostActionOnPriceProduct(ThServerApi.PriceProductsSaveItem, priceProduct);
	}
	public deletePriceProductDO(priceProduct: PriceProductDO): Observable<PriceProductDO> {
		return this.runServerPostActionOnPriceProduct(ThServerApi.PriceProductsDeleteItem, priceProduct);
	}
	public archivePriceProductDO(priceProduct: PriceProductDO): Observable<PriceProductDO> {
		return this.runServerPostActionOnPriceProduct(ThServerApi.PriceProductsArchiveItem, priceProduct);
	}
	public draftPriceProductDO(priceProduct: PriceProductDO): Observable<PriceProductDO> {
		return this.runServerPostActionOnPriceProduct(ThServerApi.PriceProductsDraftItem, priceProduct);
	}

	private runServerPostActionOnPriceProduct(apiAction: ThServerApi, priceProduct: PriceProductDO): Observable<PriceProductDO> {
		return this._appContext.thHttp.post(apiAction, { priceProduct: priceProduct }).map((addOnProductObject: Object) => {
			this.refreshData();

			var updatedPriceProductDO: PriceProductDO = new PriceProductDO();
			updatedPriceProductDO.buildFromObject(addOnProductObject["priceProduct"]);
			return updatedPriceProductDO;
		});
	}
}