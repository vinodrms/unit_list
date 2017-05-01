import {InvoiceItemDO, InvoiceItemType} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';

import _ = require('underscore');

export class IncludedBookingItems {
    private _breakfast: InvoiceItemDO;
    private _includedInvoiceItemList: InvoiceItemDO[];

    constructor() {
    }

    public getTotalPrice(): number {
        var totalPrice: number = 0.0;
        _.forEach(this._includedInvoiceItemList, (includedInvoiceItem: InvoiceItemDO) => {
            totalPrice = totalPrice + includedInvoiceItem.getTotalPrice();
        });
        return totalPrice;
    }

    public get breakfast(): InvoiceItemDO {
        return this._breakfast;
    }
    public set breakfast(breakfast: InvoiceItemDO) {
        this._breakfast = breakfast;
    }
    public get includedInvoiceItemList(): InvoiceItemDO[] {
        return this._includedInvoiceItemList;
    }
    public set includedInvoiceItemList(includedInvoiceItemList: InvoiceItemDO[]) {
        this._includedInvoiceItemList = includedInvoiceItemList;
    }
}