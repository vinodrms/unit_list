import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ALazyLoadRequestService} from '../common/ALazyLoadRequestService';
import {AddOnProductsDO} from './data-objects/AddOnProductsDO';
import {AddOnProductDO} from './data-objects/AddOnProductDO';
import {AddOnProductVM} from './view-models/AddOnProductVM';
import {TaxService} from '../taxes/TaxService';
import {TaxContainerDO} from '../taxes/data-objects/TaxContainerDO';
import {AddOnProductCategoriesService} from '../settings/AddOnProductCategoriesService';
import {AddOnProductCategoriesDO} from '../settings/data-objects/AddOnProductCategoriesDO';
import {HotelAggregatorService} from '../hotel/HotelAggregatorService';
import {HotelAggregatedInfo} from '../hotel/utils/HotelAggregatedInfo';

@Injectable()
export class AddOnProductsService extends ALazyLoadRequestService<AddOnProductVM> {
	constructor(appContext: AppContext,
		private _taxService: TaxService,
		private _addOnProductCategoriesService: AddOnProductCategoriesService,
		private _hotelAggregatorService: HotelAggregatorService) {
		super(appContext, ThServerApi.AddOnProductsCount, ThServerApi.AddOnProducts);
	}

	protected parsePageDataCore(pageDataObject: Object): Observable<AddOnProductVM[]> {
		return Observable.combineLatest(
			this._taxService.getTaxContainerDO(),
			this._addOnProductCategoriesService.getAddOnProductCategoriesDO(),
			this._hotelAggregatorService.getHotelAggregatedInfo()
		).map((result: [TaxContainerDO, AddOnProductCategoriesDO, HotelAggregatedInfo]) => {
			var taxContainer = result[0];
			var addOnProductCategories = result[1];
			var hotelDetails = result[2];

			var addOnProducts = new AddOnProductsDO();
			addOnProducts.buildFromObject(pageDataObject);

			var addOnProductVMList: AddOnProductVM[] = [];
			_.forEach(addOnProducts.addOnProductList, (addOnProductDO: AddOnProductDO) => {
				var addOnProductVM = new AddOnProductVM();
				addOnProductVM.addOnProduct = addOnProductDO;
				addOnProductVM.category = addOnProductCategories.getCategoryById(addOnProductDO.categoryId);
				addOnProductVM.taxList = taxContainer.filterTaxesByListOfIds(addOnProductDO.taxIdList);
				addOnProductVM.ccy = hotelDetails.ccy;
				addOnProductVMList.push(addOnProductVM);
			});
			return addOnProductVMList;
		});
	}
	public searchByText(text: string) {
		this.updateSearchCriteria({
			name: text
		});
	}

	public saveAddOnProductDO(addOnProduct: AddOnProductDO): Observable<AddOnProductDO> {
		return this.runServerPostActionOnAddOnProduct(ThServerApi.AddOnProductsSaveItem, addOnProduct);
	}
	public deleteAddOnProductDO(addOnProduct: AddOnProductDO): Observable<AddOnProductDO> {
		return this.runServerPostActionOnAddOnProduct(ThServerApi.AddOnProductsDeleteItem, addOnProduct);
	}

	private runServerPostActionOnAddOnProduct(apiAction: ThServerApi, addOnProduct: AddOnProductDO): Observable<AddOnProductDO> {
		return this._appContext.thHttp.post(apiAction, { addOnProduct: addOnProduct }).map((addOnProductObject: Object) => {
			this.refreshData();

			var updatedAddOnProductDO: AddOnProductDO = new AddOnProductDO();
			updatedAddOnProductDO.buildFromObject(addOnProductObject["addOnProduct"]);
			return updatedAddOnProductDO;
		});
	}
}