import {AddOnProductDO} from '../../../../data-layer/add-on-products/data-objects/AddOnProductDO';

import _ = require('underscore');

export class AddOnProductsContainer {
    private _aopList: AddOnProductDO[];

    constructor(aopList: AddOnProductDO[]) {
        this._aopList = aopList;
    }

    public get aopList(): AddOnProductDO[] {
        return this._aopList;
    }
    public set aopList(aopList: AddOnProductDO[]) {
        this._aopList = aopList;
    }

    public getAddOnProductById(aopId: string): AddOnProductDO {
        return _.find(this._aopList, (aop: AddOnProductDO) => {
            return aop.id === aopId;
        });
    }
}