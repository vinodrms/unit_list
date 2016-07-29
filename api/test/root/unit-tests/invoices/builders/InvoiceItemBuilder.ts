import {InvoiceItemDO, InvoiceItemType, IInvoiceItemDO} from '../../../../../../api/core/data-layer/invoices/data-objects/items/InvoiceItemDO';

export class InvoiceItemBuilder {
    private _id: string;
    private _type: InvoiceItemType;
    private _metaObject: Object;

    public withId(id: string): InvoiceItemBuilder {
        this._id = id;
        return this;
    }
    public withType(type: InvoiceItemType): InvoiceItemBuilder {
        this._type = type;
        return this;
    }
    public withMetaObject(meta: Object): InvoiceItemBuilder {
        this._metaObject = meta;
        return this;
    }
    
    public build(bookingInvoiceItemMeta?: IInvoiceItemDO): InvoiceItemDO {
        var invoiceItemDO = new InvoiceItemDO(bookingInvoiceItemMeta);
        invoiceItemDO.id = this._id;
        invoiceItemDO.type = this._type;
        invoiceItemDO._metaObject = this._metaObject;
        return invoiceItemDO;
    }
}