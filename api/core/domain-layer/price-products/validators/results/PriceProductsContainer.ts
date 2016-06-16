import {PriceProductDO} from '../../../../data-layer/price-products/data-objects/PriceProductDO';

import _ = require('underscore');

export class PriceProductsContainer {
    private _priceProductList: PriceProductDO[];

    constructor(priceProductList: PriceProductDO[]) {
        this._priceProductList = priceProductList;
    }

    public get priceProductList(): PriceProductDO[] {
        return this._priceProductList;
    }
    public set priceProductList(priceProductList: PriceProductDO[]) {
        this._priceProductList = priceProductList;
    }

    public getPriceProductById(priceProductId: string): PriceProductDO {
        return _.find(this._priceProductList, (priceProduct: PriceProductDO) => {
            return priceProduct.id === priceProductId;
        });
    }
}