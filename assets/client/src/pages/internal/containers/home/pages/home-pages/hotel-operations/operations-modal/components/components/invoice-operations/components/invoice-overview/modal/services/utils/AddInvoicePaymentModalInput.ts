import { CustomerDO } from "../../../../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { InvoiceOperationsPageData } from "../../../../../utils/InvoiceOperationsPageData";
import { InvoicePaymentMethodDO } from "../../../../../../../../../../../../../../services/invoices/data-objects/payer/InvoicePaymentMethodDO";

export class AddInvoicePaymentModalInput {
    private _invoiceAmountLeftToPay: number;
    private _customer: CustomerDO;
    private _invoiceOperationsPageData: InvoiceOperationsPageData;
    private _defaultInvoicePaymentMethodDO: InvoicePaymentMethodDO;

    constructor() { }

    public set invoiceAmountLeftToPay(invoiceAmountLeftToPay: number) {
        this._invoiceAmountLeftToPay = invoiceAmountLeftToPay;
    }

    public get invoiceAmountLeftToPay(): number {
        return this._invoiceAmountLeftToPay;
    }

    public set customer(customer: CustomerDO) {
        this._customer = customer;
    }

    public get customer(): CustomerDO {
        return this._customer;
    }

    public set invoiceOperationsPageData(data: InvoiceOperationsPageData) {
        this._invoiceOperationsPageData = data;
    }

    public get invoiceOperationsPageData(): InvoiceOperationsPageData {
        return this._invoiceOperationsPageData;
    }

    public set defaultInvoicePaymentMethodDO(method: InvoicePaymentMethodDO) {
        this._defaultInvoicePaymentMethodDO = method;
    }

    public get defaultInvoicePaymentMethodDO(): InvoicePaymentMethodDO {
        return this._defaultInvoicePaymentMethodDO;
    }
}