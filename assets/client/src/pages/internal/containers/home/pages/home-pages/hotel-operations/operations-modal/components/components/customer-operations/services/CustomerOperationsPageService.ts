import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';

import {HotelCustomerOperationsPageParam} from '../utils/HotelCustomerOperationsPageParam';
import {EagerCustomersService} from '../../../../../../../../../../services/customers/EagerCustomersService';
import {CustomerDO} from '../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {CustomerVM} from '../../../../../../../../../../services/customers/view-models/CustomerVM';
import {CustomerOperationsPageData} from './utils/CustomerOperationsPageData';
import {EagerPriceProductsService} from '../../../../../../../../../../services/price-products/EagerPriceProductsService';
import {PriceProductsDO} from '../../../../../../../../../../services/price-products/data-objects/PriceProductsDO';
import {PriceProductStatus} from '../../../../../../../../../../services/price-products/data-objects/PriceProductDO';
import {EagerAllotmentsService} from '../../../../../../../../../../services/allotments/EagerAllotmentsService';
import {AllotmentStatus} from '../../../../../../../../../../services/allotments/data-objects/AllotmentDO';
import {AllotmentsDO} from '../../../../../../../../../../services/allotments/data-objects/AllotmentsDO';

@Injectable()
export class CustomerOperationsPageService {
    constructor(private _eagerCustomersService: EagerCustomersService,
        private _eagerPriceProductsService: EagerPriceProductsService,
        private _eagerAllotmentsService: EagerAllotmentsService) {
    }

    public getPageData(custOpPageParam: HotelCustomerOperationsPageParam) {
        return Observable.combineLatest(
            this._eagerCustomersService.getCustomerById(custOpPageParam.customerId)
        ).flatMap((result: [CustomerDO]) => {
            var customerDO = result[0];
            return Observable.combineLatest(
                Observable.from([customerDO]),
                this._eagerPriceProductsService.getPriceProducts(PriceProductStatus.Active, customerDO.priceProductDetails.priceProductIdList),
                this._eagerAllotmentsService.getAllotments(AllotmentStatus.Active, customerDO.id, customerDO.priceProductDetails.priceProductIdList)
            );
        }).map((result: [CustomerDO, PriceProductsDO, AllotmentsDO]) => {
            var custPageData = new CustomerOperationsPageData();
            var customerVM = new CustomerVM();
            customerVM.customer = result[0];
            customerVM.priceProductList = result[1].priceProductList;
            customerVM.allotmentList = result[2].allotmentList;
            custPageData.customerVM = customerVM;
            return custPageData;
        });
    }
}