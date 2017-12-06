import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../../../common/utils/AppContext';
import { TaxService } from '../../../../../../../../../../../../services/taxes/TaxService';
import { RoomCategoriesService } from '../../../../../../../../../../../../services/room-categories/RoomCategoriesService';
import { YieldFiltersService } from '../../../../../../../../../../../../services/hotel-configurations/YieldFiltersService';
import { HotelAggregatorService } from '../../../../../../../../../../../../services/hotel/HotelAggregatorService';
import { ALazyLoadRequestService } from '../../../../../../../../../../../../services/common/ALazyLoadRequestService';
import { PriceProductAvailability, PriceProductStatus, PriceProductDO } from '../../../../../../../../../../../../services/price-products/data-objects/PriceProductDO';
import { PriceProductsDO } from '../../../../../../../../../../../../services/price-products/data-objects/PriceProductsDO';
import { TaxContainerDO } from '../../../../../../../../../../../../services/taxes/data-objects/TaxContainerDO';
import { RoomCategoryDO } from '../../../../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import { BookingDotComPriceProductConfigurationVM } from '../utils/BookingDotComPriceProductConfigurationVM';
import { YieldFiltersDO } from '../../../../../../../../../../../../services/hotel-configurations/data-objects/YieldFiltersDO';
import { HotelAggregatedInfo } from '../../../../../../../../../../../../services/hotel/utils/HotelAggregatedInfo';
import { PriceProductVM } from '../../../../../../../../../../../../services/price-products/view-models/PriceProductVM';

import _  = require('underscore');

@Injectable()
export class BookingDotComPriceProductConfigurationLazyLoadService extends ALazyLoadRequestService<BookingDotComPriceProductConfigurationVM> {
	constructor(appContext: AppContext,
		private _taxService: TaxService,
		private _roomCategoriesService: RoomCategoriesService,
		private _yieldFiltersService: YieldFiltersService,
		private _hotelAggregatorService: HotelAggregatorService) {
		super(appContext, ThServerApi.PriceProductsCount, ThServerApi.PriceProducts);
		this.defaultSearchCriteria = { status: PriceProductStatus.Active };
	}

	protected parsePageDataCore(pageDataObject: Object): Observable<BookingDotComPriceProductConfigurationVM[]> {
		var priceProducts = new PriceProductsDO();
		priceProducts.buildFromObject(pageDataObject);

		return Observable.combineLatest(
			this._taxService.getTaxContainerDO(),
			this._roomCategoriesService.getRoomCategoryList(),
			this._yieldFiltersService.getYieldFiltersDO(),
			this._hotelAggregatorService.getHotelAggregatedInfo(),
			this.getParentPriceProducts(priceProducts)
		).map((result: [TaxContainerDO, RoomCategoryDO[], YieldFiltersDO, HotelAggregatedInfo, PriceProductsDO]) => {
			var taxContainer: TaxContainerDO = result[0];
			var roomCategoryList: RoomCategoryDO[] = result[1];
			var yieldFilters: YieldFiltersDO = result[2];
			var hotelInfo: HotelAggregatedInfo = result[3];
			var parentPriceProducts: PriceProductsDO = result[4];
			var priceProductConfigurations:BookingDotComPriceProductConfigurationVM[] = [];
			
			_.forEach(priceProducts.priceProductList, (priceProductDO: PriceProductDO) => {
				var priceProductVM = new PriceProductVM(this._appContext.thTranslation);
				priceProductVM.priceProduct = priceProductDO;
				priceProductVM.ccy = hotelInfo.ccy;
				priceProductVM.initFromTaxes(taxContainer);
				priceProductVM.initFromRoomCategoryList(roomCategoryList);
				priceProductVM.initFromYieldFilters(yieldFilters);
				if (priceProductDO.hasParent()) {
					priceProductVM.parentPriceProduct = parentPriceProducts.findById(priceProductDO.parentId);
				}
				var ppConfiguration = new BookingDotComPriceProductConfigurationVM();
				ppConfiguration.priceProductVM = priceProductVM;
				ppConfiguration.enabled = true;
				priceProductConfigurations.push(ppConfiguration);
			});
			return priceProductConfigurations;
		});
	}

	private getParentPriceProducts(priceProducts: PriceProductsDO): Observable<PriceProductsDO> {
		var parentIdList = priceProducts.getParentIdList();
		if (parentIdList.length == 0) {
			return Observable.from([new PriceProductsDO()]);
		}
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.PriceProducts,
			body: JSON.stringify({
				searchCriteria: {
					priceProductIdList: parentIdList
				}
			})
		}).map((resultObject: Object) => {
			var priceProducts = new PriceProductsDO();
			priceProducts.buildFromObject(resultObject);
			return priceProducts;
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
}