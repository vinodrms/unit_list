import {Injectable} from '@angular/core';
import {InvoiceOperationsPageData} from '../services/utils/InvoiceOperationsPageData';
import {InvoiceGroupVM} from '../../../../../../../../../../services/invoices/view-models/InvoiceGroupVM';
import {InvoiceGroupDO} from '../../../../../../../../../../services/invoices/data-objects/InvoiceGroupDO';
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
    public set invoiceGroupVM(invoiceGroupVM: InvoiceGroupVM) {
        this._invoiceGroupVM = invoiceGroupVM;
    }

    public updateInvoiceGroupVM(updatedInvoiceGroup: InvoiceGroupDO) {
        this._invoiceOperationsPageData.invoiceGroupDO  = updatedInvoiceGroup;
        var updatedInvoiceGroupVM = new InvoiceGroupVM(this._appContext.thTranslation);
        updatedInvoiceGroupVM.buildFromInvoiceOperationsPageData(this._invoiceOperationsPageData);
        this._invoiceGroupVM = updatedInvoiceGroupVM;
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