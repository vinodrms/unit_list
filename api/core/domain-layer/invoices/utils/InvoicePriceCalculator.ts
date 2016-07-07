import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../utils/ThUtils';
import {InvoiceDO} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {InvoiceItemDO} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';
import {PriceProductPriceQueryDO} from '../../../data-layer/price-products/data-objects/price/IPriceProductPrice';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';

import _ = require('underscore');

export class InvoicePriceCalculator {
    private _thUtils: ThUtils;

    constructor(private _invoice: InvoiceDO, private _billingCustomer: CustomerDO) {
        this._thUtils = new ThUtils();
    }


    public getTotalPrice(priceProductPriceQuery?: PriceProductPriceQueryDO): number {
        return _.reduce(this._invoice.itemList, (totalPrice, invoiceItem: InvoiceItemDO) => {
                //TODO implement invoice price calculator     
            return totalPrice + 1;
        }, 0);
    }
}