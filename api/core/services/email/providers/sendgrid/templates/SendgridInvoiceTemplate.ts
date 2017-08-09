import {ISendgridTemplate} from '../ISendgridTemplate';
import {InvoiceEmailTemplateDO} from '../../../data-objects/InvoiceEmailTemplateDO';

export class SendgridInvoiceTemplate implements ISendgridTemplate {
    constructor(private _emailTemplateDO: InvoiceEmailTemplateDO) {
    }

    public getTemplateMetadata(): any {
        return {
            id: '995db70f-5c6c-4ea6-98be-558cfbd26239',
            subs: {
                "%hotelName%": this._emailTemplateDO.hotelName,
                "%hotelAddressLine1%": this._emailTemplateDO.hotelAddressLine1,
                "%hotelAddressLine2%": this._emailTemplateDO.hotelAddressLine2,
                "%hotelEmail%": this._emailTemplateDO.hotelEmail,
                "%hotelPhone%": this._emailTemplateDO.hotelPhone,
                "%hotelCountry%": this._emailTemplateDO.hotelCountry,
                "%invoiceDueDateText%": this._emailTemplateDO.shouldSendInvoiceDueDate ? this.getInvoiceDueDateText(): ""
            }
        };
    }

    private getInvoiceDueDateText() {
        return " We really appreciate your business! Please send payment within " + this._emailTemplateDO.paymentDueInDays + " days of receiving this invoice, on or before " + this._emailTemplateDO.paymentDueDateString + " (Date counted by UP)";
    }
}