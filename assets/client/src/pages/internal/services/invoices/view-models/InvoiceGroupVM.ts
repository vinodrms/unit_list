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
        var index = this.getInvoiceIndexByRefInTheEntireInvoiceList(reference);
        if (index != -1) {
            this._invoiceVMList.splice(index, 1);
        }
    }
    private getInvoiceIndexByRefInTheEntireInvoiceList(reference: string): number {
        for (var i = 0; i < this._invoiceVMList.length; ++i) {
            if (this._invoiceVMList[i].invoiceDO.invoiceReference === reference) {
                return i;
            }
        }
        return -1;
    }
    private getInvoiceIndexByRefInTheEditableInvoiceList(reference: string): number {
        for (var i = 0; i < this.invoiceVMList.length; ++i) {
            if (this.invoiceVMList[i].invoiceDO.invoiceReference === reference) {
                return i;
            }
        }
        return -1;
    }

    public get newInvoiceSeq(): number {
        return this._newInvoiceSeq++;
    }

    public moveInvoiceItemLeft(sourceInvoiceRef: string, invoiceItemVMIndex: number) {
        var sourceIndex = this.getInvoiceIndexByRefInTheEntireInvoiceList(sourceInvoiceRef);
        var destinationIndex = this.getLeftEditableNeighborIndex(sourceInvoiceRef);

        this.moveInvoiceItem(sourceIndex, destinationIndex, invoiceItemVMIndex);
    }
    public getLeftEditableNeighborIndex(sourceInvoiceRef: string): number {
        var indexInTheEditableInvoiceList = this.getInvoiceIndexByRefInTheEditableInvoiceList(sourceInvoiceRef);
        if (indexInTheEditableInvoiceList === 0) {
            return -1;
        }
        return this.getInvoiceIndexByRefInTheEntireInvoiceList(this.invoiceVMList[indexInTheEditableInvoiceList - 1].invoiceDO.invoiceReference);
    }
    public moveInvoiceItemRight(sourceInvoiceRef: string, invoiceItemVMIndex: number) {
        var sourceIndex = this.getInvoiceIndexByRefInTheEntireInvoiceList(sourceInvoiceRef);
        var destinationIndex = this.getRightEditableNeighborIndex(sourceInvoiceRef);

        this.moveInvoiceItem(sourceIndex, destinationIndex, invoiceItemVMIndex);
    }
    public getRightEditableNeighborIndex(sourceInvoiceRef: string): number {
        var indexInTheEditableInvoiceList = this.getInvoiceIndexByRefInTheEditableInvoiceList(sourceInvoiceRef);
        if (indexInTheEditableInvoiceList === this.invoiceVMList.length - 1) {
            return -1;
        }
        return this.getInvoiceIndexByRefInTheEntireInvoiceList(this.invoiceVMList[indexInTheEditableInvoiceList + 1].invoiceDO.invoiceReference);
    }
    private moveInvoiceItem(sourceInvoiceIndex: number, destinationInvoiceIndex: number, invoiceItemIndex: number) {
        this._invoiceVMList[destinationInvoiceIndex].invoceItemVMList.push(this._invoiceVMList[sourceInvoiceIndex].invoceItemVMList[invoiceItemIndex]);
        this._invoiceVMList[destinationInvoiceIndex].invoiceDO.itemList.push(this._invoiceVMList[sourceInvoiceIndex].invoceItemVMList[invoiceItemIndex].invoiceItemDO);

        this._invoiceVMList[sourceInvoiceIndex].invoceItemVMList.splice(invoiceItemIndex, 1);
        this._invoiceVMList[sourceInvoiceIndex].invoiceDO.itemList.splice(invoiceItemIndex, 1);

        this.updatePriceToPayIfSinglePayerByIndex(sourceInvoiceIndex);
        this.updatePriceToPayIfSinglePayerByIndex(destinationInvoiceIndex);
    }

    public updatePriceToPayIfSinglePayerByRef(invoiceRef: string) {
        var index = this.getInvoiceIndexByRefInTheEntireInvoiceList(invoiceRef);

        this.updatePriceToPayIfSinglePayerByIndex(index);
    }

    private updatePriceToPayIfSinglePayerByIndex(index: number) {
        if (this._invoiceVMList[index].invoicePayerVMList.length === 1) {
            this._invoiceVMList[index].invoicePayerVMList[0].invoicePayerDO.priceToPay = this._invoiceVMList[index].totalPrice;
        }
    }
}