import { CustomerDO } from "../../../../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { InvoiceOperationsPageData } from "../../../../../utils/InvoiceOperationsPageData";

export class AddInvoicePaymentModalInput {
    private _invoiceAmountLeftToPay: number;
    private _customer: CustomerDO;
    private _invoiceOperationsPageData: InvoiceOperationsPageData;

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
}