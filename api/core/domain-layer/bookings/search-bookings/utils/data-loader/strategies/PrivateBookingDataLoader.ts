import { ThError } from '../../../../../../utils/th-responses/ThError';
import { AppContext } from '../../../../../../utils/AppContext';
import { SessionContext } from '../../../../../../utils/SessionContext';
import { BookingSearchDependencies } from '../results/BookingSearchDependencies';
import { ABookingDataLoader } from '../ABookingDataLoader';
import { CustomerDO } from '../../../../../../data-layer/customers/data-objects/CustomerDO';
import { PriceProductDO, PriceProductStatus } from '../../../../../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductSearchResultRepoDO } from '../../../../../../data-layer/price-products/repositories/IPriceProductRepository';
import { AllotmentStatus } from '../../../../../../data-layer/allotments/data-objects/AllotmentDO';
import { AllotmentSearchResultRepoDO } from '../../../../../../data-layer/allotments/repositories/IAllotmentRepository';

import _ = require('underscore');

export class PrivateBookingDataLoader extends ABookingDataLoader {
    private _loadedCustomer: CustomerDO;
    private _loadedPriceProductList: PriceProductDO[];

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _customerId: string) {
        super();
    }

    protected loadDataCore(resolve: { (result: BookingSearchDependencies): void }, reject: { (err: ThError): void }) {
        var customersRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
        customersRepo.getCustomerById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._customerId)
            .then((loadedCustomer: CustomerDO) => {
                this._loadedCustomer = loadedCustomer;

                var priceProductsRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
                return priceProductsRepo.getPriceProductList({ hotelId: this._sessionContext.sessionDO.hotel.id },
                    {
                        status: PriceProductStatus.Active,
                        customerPriceProductDetails: this._loadedCustomer.priceProductDetails
                    });
            }).then((priceProductSearchResult: PriceProductSearchResultRepoDO) => {
                this._loadedPriceProductList = priceProductSearchResult.priceProductList;

                var allotmentRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
                return allotmentRepo.getAllotmentList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    status: AllotmentStatus.Active,
                    customerId: this._customerId,
                    priceProductIdList: this.getPriceProductIdList()
                });
            }).then((allotmentSearchResult: AllotmentSearchResultRepoDO) => {
                resolve(new BookingSearchDependencies(this._loadedPriceProductList, allotmentSearchResult.allotmentList, this._loadedCustomer));
            }).catch((error: any) => {
                reject(error);
            });
    }
    private getPriceProductIdList(): string[] {
        return _.map(this._loadedPriceProductList, (priceProduct: PriceProductDO) => { return priceProduct.id });
    }
}