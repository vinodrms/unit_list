import {Injectable} from '@angular/core';
import {InvoiceOperationsPageData} from '../services/utils/InvoiceOperationsPageData';
import {InvoiceGroupVM} from '../../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import {AppContext, ThServerApi} from '../../../../../../../../../../../../common/utils/AppContext';
import {ThTranslation} from '../../../../../../../../../../../../common/utils/localization/ThTranslation';

@Injectable()
export class InvoiceGroupControllerService {
    private _invoiceGroupVM: InvoiceGroupVM;
    private _invoiceOperationsPageData: InvoiceOperationsPageData;

    constructor(private _appContext: AppContext) {
    }

    public get invoiceGroupVM(): InvoiceGroupVM {
        return this._invoiceGroupVM;
    }

    public get invoiceOperationsPageData(): InvoiceOperationsPageData {
        return this._invoiceOperationsPageData;
    }
    public set invoiceOperationsPageData(invoiceOperationsPageData: InvoiceOperationsPageData) {
        this._invoiceOperationsPageData = invoiceOperationsPageData;
        this.buildInvoiceGroupVM();
    }
    private buildInvoiceGroupVM() {
        this._invoiceGroupVM = new InvoiceGroupVM(this._appContext.thTranslation);
        this._invoiceGroupVM.buildFromInvoiceOperationsPageData(this._invoiceOperationsPageData);
    }
}