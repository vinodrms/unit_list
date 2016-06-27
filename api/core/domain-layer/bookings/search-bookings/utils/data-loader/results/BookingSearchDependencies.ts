import {PriceProductDO} from '../../../../../../data-layer/price-products/data-objects/PriceProductDO';
import {AllotmentDO} from '../../../../../../data-layer/allotments/data-objects/AllotmentDO';
import {CustomerDO} from '../../../../../../data-layer/customers/data-objects/CustomerDO';
import {ThUtils} from '../../../../../../utils/ThUtils';

import _ = require('underscore');

export class BookingSearchDependencies {
    private _thUtils: ThUtils;

    private _priceProductList: PriceProductDO[];
    private _priceProductWithAllotmentList: PriceProductDO[];
    private _allotmentList: AllotmentDO[];
    private _customer: CustomerDO;

    constructor(priceProductList: PriceProductDO[], allotmentList: AllotmentDO[], customer?: CustomerDO) {
        this._thUtils = new ThUtils();

        this.priceProductList = priceProductList;
        this.priceProductWithAllotmentList = priceProductList;
        this.allotmentList = allotmentList;
        this.customer = customer;
    }

    public get priceProductList(): PriceProductDO[] {
        return this._priceProductList;
    }
    public set priceProductList(priceProductList: PriceProductDO[]) {
        this._priceProductList = priceProductList;
    }
    public get priceProductWithAllotmentList(): PriceProductDO[] {
        return this._priceProductWithAllotmentList;
    }
    public set priceProductWithAllotmentList(priceProductWithAllotmentList: PriceProductDO[]) {
        this._priceProductWithAllotmentList = priceProductWithAllotmentList;
    }
    public get allotmentList(): AllotmentDO[] {
        return this._allotmentList;
    }
    public set allotmentList(allotmentList: AllotmentDO[]) {
        this._allotmentList = allotmentList;
        this._priceProductWithAllotmentList = _.filter(this._priceProductWithAllotmentList, (priceProduct: PriceProductDO) => {
            return this.containsAllotmentForPriceProductId(priceProduct.id);
        });
    }
    private containsAllotmentForPriceProductId(priceProductId: string): boolean {
        return !this._thUtils.isUndefinedOrNull(
            _.find(this._allotmentList, (allotment: AllotmentDO) => {
                return allotment.priceProductId === priceProductId;
            })
        )
    }

    public get customer(): CustomerDO {
        return this._customer;
    }
    public set customer(customer: CustomerDO) {
        this._customer = customer;
    }

    public getMergedPriceProductList(): PriceProductDO[] {
        var mergedPriceProductList: PriceProductDO[] = [];
        mergedPriceProductList = mergedPriceProductList.concat(this._priceProductList);
        _.forEach(this._priceProductWithAllotmentList, (priceProductWithAllotment: PriceProductDO) => {
            if (!this.containsPriceProductWithId(priceProductWithAllotment.id)) {
                mergedPriceProductList.push(priceProductWithAllotment);
            }
        });
        return mergedPriceProductList;
    }
    private containsPriceProductWithId(priceProductId: string) {
        return !this._thUtils.isUndefinedOrNull(
            _.find(this._priceProductList, (priceProduct: PriceProductDO) => {
                return priceProduct.id === priceProductId;
            })
        );
    }
}