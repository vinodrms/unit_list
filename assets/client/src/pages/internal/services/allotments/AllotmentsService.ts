import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ALazyLoadRequestService } from '../common/ALazyLoadRequestService';
import { RoomCategoriesService } from '../room-categories/RoomCategoriesService';
import { RoomCategoryDO } from '../room-categories/data-objects/RoomCategoryDO';
import { EagerPriceProductsService } from '../price-products/EagerPriceProductsService';
import { PriceProductDO, PriceProductStatus } from '../price-products/data-objects/PriceProductDO';
import { PriceProductsDO } from '../price-products/data-objects/PriceProductsDO';
import { EagerCustomersService } from '../customers/EagerCustomersService';
import { CustomersDO } from '../customers/data-objects/CustomersDO';
import { CustomerDO } from '../customers/data-objects/CustomerDO';

import { AllotmentVM } from './view-models/AllotmentVM';
import { AllotmentsDO } from './data-objects/AllotmentsDO';
import { AllotmentDO, AllotmentStatus } from './data-objects/AllotmentDO';
import { AllotmentConstraintMeta } from './data-objects/constraint/IAllotmentConstraint';
import { AllotmentConstraintFactory } from './data-objects/constraint/AllotmentConstraintFactory';

import * as _ from "underscore";

@Injectable()
export class AllotmentsService extends ALazyLoadRequestService<AllotmentVM> {
	constructor(appContext: AppContext,
		private _roomCategoriesService: RoomCategoriesService,
		private _eagerPriceProductsService: EagerPriceProductsService,
		private _eagerCustomersService: EagerCustomersService) {
		super(appContext, ThServerApi.AllotmentsCount, ThServerApi.Allotments);
		this.defaultSearchCriteria = { status: AllotmentStatus.Active };
	}

	protected parsePageDataCore(pageDataObject: Object): Observable<AllotmentVM[]> {
		var allotments = new AllotmentsDO();
		allotments.buildFromObject(pageDataObject);

		var priceProductIdList: string[] = _.map(allotments.allotmentList, (allotmentDO: AllotmentDO) => { return allotmentDO.priceProductId });
		var customerIdList: string[] = _.map(allotments.allotmentList, (allotmentDO: AllotmentDO) => { return allotmentDO.customerId });

		return Observable.combineLatest(
			this._roomCategoriesService.getRoomCategoryList(),
			this._eagerPriceProductsService.getPriceProducts(PriceProductStatus.Active, priceProductIdList),
			this._eagerCustomersService.getCustomersById(customerIdList)
		).map((result: [RoomCategoryDO[], PriceProductsDO, CustomersDO]) => {
			var roomCategoryList: RoomCategoryDO[] = result[0];
			var priceProductList: PriceProductDO[] = result[1].priceProductList;
			var customerList: CustomerDO[] = result[2].customerList;

			var allotmentVMList: AllotmentVM[] = [];
			var constraintFactory = new AllotmentConstraintFactory();
			var allotmentConstraintMetaList: AllotmentConstraintMeta[] = constraintFactory.getAllotmentConstraintMetaList();
			_.forEach(allotments.allotmentList, (allotmentDO: AllotmentDO) => {
				var allotmentVM = new AllotmentVM(this._appContext.thTranslation);
				allotmentVM.allotment = allotmentDO;
				allotmentVM.roomCategory = _.find(roomCategoryList, (category: RoomCategoryDO) => { return category.id === allotmentDO.roomCategoryId });
				allotmentVM.priceProduct = _.find(priceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id === allotmentDO.priceProductId });
				allotmentVM.customer = _.find(customerList, (customer: CustomerDO) => { return customer.id === allotmentDO.customerId });
				allotmentVM.constraintMetaList = allotmentConstraintMetaList;

				allotmentVMList.push(allotmentVM);
			});
			return allotmentVMList;
		});
	}
	public searchByText(text: string) {
		this.updateSearchCriteria({
			notes: text
		});
	}
	public setStatusFilter(status: AllotmentStatus) {
		this.defaultSearchCriteria = {
			status: status
		}
	}

	public saveAllotmentDO(allotment: AllotmentDO): Observable<AllotmentDO> {
		return this.runServerPostActionOnAllotment(ThServerApi.AllotmentsSaveItem, allotment);
	}
	public archiveAllotmentDO(allotment: AllotmentDO): Observable<AllotmentDO> {
		return this.runServerPostActionOnAllotment(ThServerApi.AllotmentsArchiveItem, allotment);
	}
	private runServerPostActionOnAllotment(apiAction: ThServerApi, allotment: AllotmentDO): Observable<AllotmentDO> {
		return this._appContext.thHttp.post({
			serverApi: apiAction,
			body: JSON.stringify({
				allotment: allotment
			})
		}).map((allotmentObject: Object) => {
			this.refreshData();

			var updatedAllotmentDO: AllotmentDO = new AllotmentDO();
			updatedAllotmentDO.buildFromObject(allotmentObject["allotment"]);
			return updatedAllotmentDO;
		});
	}
}