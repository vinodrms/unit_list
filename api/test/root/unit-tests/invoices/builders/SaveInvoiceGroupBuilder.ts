import {InvoiceDO, InvoicePaymentStatus} from '../../../../../../api/core/data-layer/invoices/data-objects/InvoiceDO';
import {SaveInvoiceGroupDO} from '../../../../../../api/core/domain-layer/invoices/save-invoice-group/SaveInvoiceGroupDO';

export class SaveInvoiceGroupBuilder {
    private _id: string;
    private _groupBookingId: string;
    private _invoiceList: InvoiceDO[];
    private _paymentStatus: InvoicePaymentStatus;

    public withId(id: string): SaveInvoiceGroupBuilder {
        this._id = id;
        return this;
    }
    public withGroupBookingId(groupBookingId: string): SaveInvoiceGroupBuilder {
        this._groupBookingId = groupBookingId;
        return this;
    }
    public withInvoiceList(invoiceList: InvoiceDO[]): SaveInvoiceGroupBuilder {
        this._invoiceList = invoiceList;
        return this;
    }
    public withPaymentStatus(paymentStatus: InvoicePaymentStatus): SaveInvoiceGroupBuilder {
        this._paymentStatus = paymentStatus;
        return this;
    }

    public build(): SaveInvoiceGroupDO {
        var saveInvoiceGroupDO = new SaveInvoiceGroupDO();
        saveInvoiceGroupDO.id = this._id;
        saveInvoiceGroupDO.groupBookingId = this._groupBookingId;
        saveInvoiceGroupDO.invoiceList = this._invoiceList;
        saveInvoiceGroupDO.paymentStatus = this._paymentStatus;
        return saveInvoiceGroupDO;
    }
}