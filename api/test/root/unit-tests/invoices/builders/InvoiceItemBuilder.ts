import { InvoiceItemDO, InvoiceItemType, InvoiceItemAccountingType } from '../../../../../../api/core/data-layer/invoices/data-objects/items/InvoiceItemDO';
import { IInvoiceItemMeta } from '../../../../../../api/core/data-layer/invoices/data-objects/items/IInvoiceItemMeta';

import _ = require("underscore");

export class InvoiceItemBuilder {
    private _id: string;
    private _type: InvoiceItemType;
    private _accountingType: InvoiceItemAccountingType;
    private _meta: IInvoiceItemMeta;

    public withId(id: string): InvoiceItemBuilder {
        this._id = id;
        return this;
    }
    public withType(type: InvoiceItemType): InvoiceItemBuilder {
        this._type = type;
        return this;
    }
    public withAccountingType(accountingType: InvoiceItemAccountingType): InvoiceItemBuilder {
        this._accountingType = accountingType;
        return this;
    }
    public withMetaObject(meta: IInvoiceItemMeta): InvoiceItemBuilder {
        this._meta = meta;
        return this;
    }

    public build(): InvoiceItemDO {
        var invoiceItemDO = new InvoiceItemDO();
        invoiceItemDO.id = this._id;
        invoiceItemDO.type = this._type;
        invoiceItemDO.meta = this._meta;

        if (!_.isUndefined(this._accountingType)) {
            invoiceItemDO.accountingType = this._accountingType;
        }

        return invoiceItemDO;
    }
}