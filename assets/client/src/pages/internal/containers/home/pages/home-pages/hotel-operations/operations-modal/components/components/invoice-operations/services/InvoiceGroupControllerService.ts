import {Injectable} from '@angular/core';
import {InvoiceOperationsPageData} from '../services/utils/InvoiceOperationsPageData';

export enum InvoiceItemMoveActionType {
    LEFT,
    RIGHT
}

export class InvoiceItemMoveAction {
    type: InvoiceItemMoveActionType;
    invoiceItemIndex: number;
    sourceInvoiceIndex: number;
}

@Injectable()
export class InvoiceGroupControllerService {
    
    private _invoiceOperationsPageData: InvoiceOperationsPageData;

    constructor() {

    }

    public get invoiceOperationsPageData(): InvoiceOperationsPageData {
        return this._invoiceOperationsPageData;
    }
    public set invoiceOperationsPageData(invoiceOperationsPageData: InvoiceOperationsPageData) {
        this._invoiceOperationsPageData = invoiceOperationsPageData;
    }
}