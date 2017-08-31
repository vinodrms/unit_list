import { InvoiceDO } from "../data-objects/InvoiceDO";
import { CustomerDO } from "../../customers/data-objects/CustomerDO";

export class InvoiceVM {
    private _invoice: InvoiceDO;
    private _customerList: CustomerDO[];

    public get invoice(): InvoiceDO {
        return this._invoice;
    }
    public set invoice(value: InvoiceDO) {
        this._invoice = value;
    }

    public get customerList(): CustomerDO[] {
        return this._customerList;
    }
    public set customerList(value: CustomerDO[]) {
        this._customerList = value;
    }
}
