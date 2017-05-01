import { InvoiceDO, InvoicePaymentStatus, InvoiceAccountingType } from '../../../../../../api/core/data-layer/invoices/data-objects/InvoiceDO';
import { InvoicePayerDO } from '../../../../../../api/core/data-layer/invoices/data-objects/payers/InvoicePayerDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../../../../api/core/data-layer/invoices/data-objects/items/InvoiceItemDO';

export class InvoiceBuilder {
    private _accountingType: InvoiceAccountingType;
    private _bookingId: string;
    private _payerList: InvoicePayerDO[];
    private _itemList: InvoiceItemDO[];
    private _paymentStatus: InvoicePaymentStatus;

    public withAccountingType(accountingType: InvoiceAccountingType): InvoiceBuilder {
        this._accountingType = accountingType;
        return this;
    }
    public withBookingId(bookingId: string): InvoiceBuilder {
        this._bookingId = bookingId;
        return this;
    }
    public withPayerList(payerList: InvoicePayerDO[]): InvoiceBuilder {
        this._payerList = payerList;
        return this;
    }
    public withItemList(itemList: InvoiceItemDO[]): InvoiceBuilder {
        this._itemList = itemList;
        return this;
    }
    public withPaymentStatus(paymentStatus: InvoicePaymentStatus): InvoiceBuilder {
        this._paymentStatus = paymentStatus;
        return this;
    }

    public build(): InvoiceDO {
        var invoice = new InvoiceDO();
        invoice.accountingType = this._accountingType;
        invoice.bookingId = this._bookingId;
        invoice.payerList = this._payerList;
        invoice.itemList = this._itemList;
        invoice.paymentStatus = this._paymentStatus;
        return invoice;
    }
}