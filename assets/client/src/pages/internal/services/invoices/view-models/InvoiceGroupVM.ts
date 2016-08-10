import {InvoiceDO} from '../data-objects/InvoiceDO';
import {InvoiceVM} from './InvoiceVM';
import {InvoiceOperationsPageData} from '../../../containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/services/utils/InvoiceOperationsPageData';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';

export class InvoiceGroupVM {
    invoiceVMList: InvoiceVM[];
    ccySymbol: string;
    
    editMode: boolean;
    
    constructor(private _thTranslation: ThTranslation) {
        this.editMode = false;
    }

    public buildFromInvoiceOperationsPageData(invoiceOperationsPageData: InvoiceOperationsPageData) {
        this.ccySymbol = invoiceOperationsPageData.ccy.symbol;
        
        this.invoiceVMList = [];
        _.forEach(invoiceOperationsPageData.invoiceGroupDO.invoiceList, (invoice: InvoiceDO) => {
            var invoiceVM = new InvoiceVM(this._thTranslation);
            invoiceVM.buildFromInvoiceDOAndCustomersDO(invoice, invoiceOperationsPageData.customersContainer);
            this.invoiceVMList.push(invoiceVM);
        });

    }   
}