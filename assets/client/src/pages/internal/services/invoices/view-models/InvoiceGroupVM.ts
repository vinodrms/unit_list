import {InvoiceDO} from '../data-objects/InvoiceDO';
import {InvoiceGroupDO} from '../data-objects/InvoiceGroupDO';
import {InvoiceVM} from './InvoiceVM';
import {InvoiceItemVM} from './InvoiceItemVM';
import {InvoicePayerVM} from './InvoicePayerVM';
import {InvoiceOperationsPageData} from '../../../containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/services/utils/InvoiceOperationsPageData';
import {ThTranslation} from '../../../../../common/utils/localization/ThTranslation';

export class InvoiceGroupVM {
    invoiceGroupDO: InvoiceGroupDO;
    private _invoiceVMList: InvoiceVM[];
    private _newInvoiceSeq: number;

    ccySymbol: string;
    editMode: boolean;

    constructor(private _thTranslation: ThTranslation) {
        this.editMode = false;
        this._newInvoiceSeq = 1;
    }

    public buildFromInvoiceOperationsPageData(invoiceOperationsPageData: InvoiceOperationsPageData) {
        this.invoiceGroupDO = invoiceOperationsPageData.invoiceGroupDO;

        this.invoiceVMList = [];
        _.forEach(this.invoiceGroupDO.invoiceList, (invoice: InvoiceDO) => {
            var invoiceVM = new InvoiceVM(this._thTranslation);
            invoiceVM.buildFromInvoiceDOAndCustomersDO(invoice, invoiceOperationsPageData.customersContainer);
            this.invoiceVMList.push(invoiceVM);
        });
        this.ccySymbol = invoiceOperationsPageData.ccy.symbol;
    }

    public buildInvoiceGroupDO(): InvoiceGroupDO {
        this.invoiceGroupDO.invoiceList = [];
        _.forEach(this.invoiceVMList, (invoiceVM: InvoiceVM) => {
            this.invoiceGroupDO.invoiceList.push(invoiceVM.invoiceDO);
        });
        return this.invoiceGroupDO;
    }

    public checkValidations(): number {
        var firstInvalidInvoiceIndex = -1;
        for (var i = 0; i < this.invoiceVMList.length; ++i) {
            var invoiceValid: boolean = this.invoiceVMList[i].isValid();
            if (!invoiceValid && firstInvalidInvoiceIndex === -1) {
                firstInvalidInvoiceIndex = i;
            }
        }
        return firstInvalidInvoiceIndex;
    }

    public buildPrototype(): InvoiceGroupVM {
        var invoiceGroupVMCopy = new InvoiceGroupVM(this._thTranslation);

        var invoiceGroupDOCopy = new InvoiceGroupDO();
        invoiceGroupDOCopy.buildFromObject(this.invoiceGroupDO);
        invoiceGroupVMCopy.invoiceGroupDO = invoiceGroupDOCopy;

        invoiceGroupVMCopy.invoiceVMList = [];
        _.forEach(this.invoiceVMList, (invoiceVM: InvoiceVM) => {
            invoiceGroupVMCopy.invoiceVMList.push(invoiceVM.buildPrototype());
        });

        invoiceGroupVMCopy.ccySymbol = this.ccySymbol;
        invoiceGroupVMCopy.editMode = this.editMode;

        return invoiceGroupVMCopy;
    }

    public get invoiceVMList(): InvoiceVM[] {
        if (this.editMode) {
            return this.getUnpaidInvoiceVMList();
        }
        return this._invoiceVMList;
    }
    public set invoiceVMList(invoiceVMList: InvoiceVM[]) {
        this._invoiceVMList = invoiceVMList;
    }

    public getUnpaidInvoiceVMList(): InvoiceVM[] {
        return _.filter(this._invoiceVMList, (invoiceVM: InvoiceVM) => {
            return !invoiceVM.invoiceDO.isPaid;
        });
    }

    public addInvoiceVM(newInvoiceVM: InvoiceVM) {
        this._invoiceVMList.push(newInvoiceVM);
    }
    public removeInvoiceVMByReference(reference: string) {
        for(var i = 0; i < this._invoiceVMList.length; ++i) {
            if(this._invoiceVMList[i].invoiceDO.invoiceReference === reference) {
                this._invoiceVMList.splice(i, 1);
                return;
            }
        }
    }
    public get newInvoiceSeq(): number {
        return this._newInvoiceSeq++;
    }
}