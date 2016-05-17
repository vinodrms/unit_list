import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {EagerPriceProductsService} from '../../../../../../../../../services/price-products/EagerPriceProductsService';
import {RoomCategoriesService} from '../../../../../../../../../services/room-categories/RoomCategoriesService';
import {PriceProductDO, PriceProductStatus} from '../../../../../../../../../services/price-products/data-objects/PriceProductDO';
import {PriceProductsDO} from '../../../../../../../../../services/price-products/data-objects/PriceProductsDO';
import {CustomerDO} from '../../../../../../../../../services/customers/data-objects/CustomerDO';
import {RoomCategoryDO} from '../../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {CustomerIndexedDetails} from './utils/CustomerIndexedDetails';

@Injectable()
export class CustomerDetailsService {

	constructor(private _roomCategoriesService: RoomCategoriesService, private _eagerPriceProductsService: EagerPriceProductsService) {
	}

	public getCustomerIndexedDetails(customer: CustomerDO): Observable<CustomerIndexedDetails> {
		return Observable.combineLatest(
			this._roomCategoriesService.getRoomCategoryList(),
			this._eagerPriceProductsService.getPriceProducts(PriceProductStatus.Active, customer.priceProductDetails.priceProductIdList)
		).map((result: [RoomCategoryDO[], PriceProductsDO]) => {
			var customerIndexedDetails = new CustomerIndexedDetails();
			customerIndexedDetails.roomCategoryList = result[0];
			customerIndexedDetails.priceProductList = result[1].priceProductList;
			return customerIndexedDetails;
		});
	}
}