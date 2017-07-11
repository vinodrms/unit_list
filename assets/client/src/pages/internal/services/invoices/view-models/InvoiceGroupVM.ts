import { InvoiceDO, InvoiceAccountingType } from '../data-objects/InvoiceDO';
import { InvoiceGroupDO } from '../data-objects/InvoiceGroupDO';
import { InvoiceVM } from './InvoiceVM';
import { InvoiceItemDO, InvoiceItemType } from '../data-objects/items/InvoiceItemDO';
import { InvoiceItemVM } from './InvoiceItemVM';
import { InvoicePayerVM } from './InvoicePayerVM';
import { InvoiceOperationsPageData } from '../../../containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/services/utils/InvoiceOperationsPageData';
import { ThTranslation } from '../../../../../common/utils/localization/ThTranslation';
import { ThUtils } from '../../../../../common/utils/ThUtils';

import * as _ from "underscore";

export class InvoiceGroupVM {
    invoiceGroupDO: InvoiceGroupDO;
    private _thUtils: ThUtils;
    private _invoiceVMList: InvoiceVM[];
    private _newInvoiceSeq: number;

    ccySymbol: string;
    editMode: boolean;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
        this.editMode = false;
        this._newInvoiceSeq = 1;
    }

    public buildFromInvoiceOperationsPageData(invoiceOperationsPageData: InvoiceOperationsPageData) {
        this.invoiceGroupDO = invoiceOperationsPageData.invoiceGroupDO;
        this.invoiceVMList = [];
        _.forEach(this.invoiceGroupDO.invoiceList, (invoice: InvoiceDO) => {
            var invoiceVM = new InvoiceVM(this._thTranslation);
            invoiceVM.buildFromInvoiceDOAndCustomersDO(invoice, invoiceOperationsPageData.customersContainer);
            if (this._thUtils.isUndefinedOrNull(this.invoiceGroupDO.id)) {
                invoiceVM.newlyAdded = true;
            }

            invoiceVM.credited = this.invoiceWasCredited(invoice);
            this.invoiceVMList.push(invoiceVM);
        });
        this.ccySymbol = invoiceOperationsPageData.ccy.symbol;
    }

    private invoiceWasCredited(invoice: InvoiceDO): boolean {
        if(invoice.accountingType === InvoiceAccountingType.Credit) {
            return false;
        }
        let invoiceRefToLookUp = invoice.invoiceReference;
        let invoiceWasCredited = false;
        _.forEach(this.invoiceGroupDO.invoiceList, (invoice: InvoiceDO) => {
            if(invoiceRefToLookUp === invoice.invoiceReference && invoice.accountingType === InvoiceAccountingType.Credit) {
                invoiceWasCredited = true;
            }
        });

        return invoiceWasCredited;
    }

    public buildInvoiceGroupDO(): InvoiceGroupDO {
        this.invoiceGroupDO.invoiceList = [];
        _.forEach(this._invoiceVMList, (invoiceVM: InvoiceVM) => {
            if (invoiceVM.isNewlyAdded) {
                delete invoiceVM.invoiceDO.invoiceReference;
            }
            invoiceVM.invoiceDO.payerList = [];
            _.forEach(invoiceVM.invoicePayerVMList, (invoicePayerVM: InvoicePayerVM) => {
                invoiceVM.invoiceDO.payerList.push(invoicePayerVM.invoicePayerDO);
            });
            invoiceVM.invoiceDO.removeItemsPopulatedFromBooking();

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
        invoiceGroupVMCopy.invoiceGroupDO.invoiceList = [];
        _.forEach(this._invoiceVMList, (invoiceVM: InvoiceVM) => {
            var invoiceVMCopy = invoiceVM.buildPrototype();
            invoiceGroupVMCopy.invoiceVMList.push(invoiceVMCopy);
            invoiceGroupVMCopy.invoiceGroupDO.invoiceList.push(invoiceVMCopy.invoiceDO);
        });

        invoiceGroupVMCopy.ccySymbol = this.ccySymbol;
        invoiceGroupVMCopy.editMode = this.editMode;

        return invoiceGroupVMCopy;
    }

    public get invoiceVMList(): InvoiceVM[] {
        if (this.editMode) {
            return this.getOpenInvoiceVMList();
        }
        return this._invoiceVMList;
    }
    public set invoiceVMList(invoiceVMList: InvoiceVM[]) {
        this._invoiceVMList = invoiceVMList;
    }

    public getOpenInvoiceVMList(): InvoiceVM[] {
        return _.filter(this._invoiceVMList, (invoiceVM: InvoiceVM) => {
            return !invoiceVM.invoiceDO.isClosed;
        });
    }

    public addInvoiceVM(newInvoiceVM: InvoiceVM) {
        this._invoiceVMList.push(newInvoiceVM);
    }
    public removeInvoiceVMByUniqueId(uniqueId: string) {
        var index = this.getInvoiceIndexByUniqueIdInTheEntireInvoiceList(uniqueId);
        if (index != -1) {
            this._invoiceVMList.splice(index, 1);
        }
    }
    private getInvoiceIndexByUniqueIdInTheEntireInvoiceList(uniqueId: string): number {
        for (var i = 0; i < this._invoiceVMList.length; ++i) {
            if (this._invoiceVMList[i].invoiceDO.uniqueIdentifierEquals(uniqueId)) {
                return i;
            }
        }
        return -1;
    }
    private getInvoiceIndexByUniqueIdInTheEditableInvoiceList(uniqueId: string): number {
        for (var i = 0; i < this.invoiceVMList.length; ++i) {
            if (this.invoiceVMList[i].invoiceDO.uniqueIdentifierEquals(uniqueId)) {
                return i;
            }
        }
        return -1;
    }

    public get newInvoiceSeq(): number {
        return this._newInvoiceSeq++;
    }

    public moveInvoiceItemLeft(sourceInvoiceUniqueId: string, invoiceItemVMIndex: number) {
        var sourceIndex = this.getInvoiceIndexByUniqueIdInTheEntireInvoiceList(sourceInvoiceUniqueId);
        var destinationIndex = this.getLeftEditableNeighborIndex(sourceInvoiceUniqueId);

        this.moveInvoiceItem(sourceIndex, destinationIndex, invoiceItemVMIndex);
    }
    public getLeftEditableNeighborIndex(sourceInvoiceUniqueId: string): number {
        var indexInTheEditableInvoiceList = this.getInvoiceIndexByUniqueIdInTheEditableInvoiceList(sourceInvoiceUniqueId);
        if (indexInTheEditableInvoiceList === 0) {
            return -1;
        }
        return this.getInvoiceIndexByUniqueIdInTheEntireInvoiceList(this.invoiceVMList[indexInTheEditableInvoiceList - 1].invoiceDO.getUniqueIdentifier());
    }
    public moveInvoiceItemRight(sourceInvoiceRef: string, invoiceItemVMIndex: number) {
        var sourceIndex = this.getInvoiceIndexByUniqueIdInTheEntireInvoiceList(sourceInvoiceRef);
        var destinationIndex = this.getRightEditableNeighborIndex(sourceInvoiceRef);

        this.moveInvoiceItem(sourceIndex, destinationIndex, invoiceItemVMIndex);
    }
    public getRightEditableNeighborIndex(sourceInvoiceRef: string): number {
        var indexInTheEditableInvoiceList = this.getInvoiceIndexByUniqueIdInTheEditableInvoiceList(sourceInvoiceRef);
        if (indexInTheEditableInvoiceList === this.invoiceVMList.length - 1) {
            return -1;
        }
        return this.getInvoiceIndexByUniqueIdInTheEntireInvoiceList(this.invoiceVMList[indexInTheEditableInvoiceList + 1].invoiceDO.getUniqueIdentifier());
    }
    private moveInvoiceItem(sourceInvoiceIndex: number, destinationInvoiceIndex: number, invoiceItemIndex: number) {
        this._invoiceVMList[destinationInvoiceIndex].invoceItemVMList.push(this._invoiceVMList[sourceInvoiceIndex].invoceItemVMList[invoiceItemIndex]);
        this._invoiceVMList[destinationInvoiceIndex].invoiceDO.itemList.push(this._invoiceVMList[sourceInvoiceIndex].invoceItemVMList[invoiceItemIndex].invoiceItemDO);

        this._invoiceVMList[sourceInvoiceIndex].invoceItemVMList.splice(invoiceItemIndex, 1);
        this._invoiceVMList[sourceInvoiceIndex].invoiceDO.itemList.splice(invoiceItemIndex, 1);

        this.updatePriceToPayIfSinglePayerByIndex(sourceInvoiceIndex);
        this.updatePriceToPayIfSinglePayerByIndex(destinationInvoiceIndex);
    }

    public updatePriceToPayIfSinglePayerByUniqueIdentifier(invoiceUniqueId: string) {
        var index = this.getInvoiceIndexByUniqueIdInTheEntireInvoiceList(invoiceUniqueId);
        this.updatePriceToPayIfSinglePayerByIndex(index);
    }

    private updatePriceToPayIfSinglePayerByIndex(index: number) {
        if (this._invoiceVMList[index].invoicePayerVMList.length === 1) {
            this._invoiceVMList[index].invoicePayerVMList[0].invoicePayerDO.priceToPay = this._invoiceVMList[index].totalPrice;
            this._invoiceVMList[index].isValid();
        }
    }

    public allInvoicesAreNewlyAdded(): boolean {
        for (var i = 0; i < this._invoiceVMList.length; ++i) {
            if (!this._invoiceVMList[i].isNewlyAdded) {
                return false;
            }
        }
        return true;
    }
    public get atLeastOneInvoiceUnpaid(): boolean {
        for (var i = 0; i < this.invoiceVMList.length; ++i) {
            if (!this.invoiceVMList[i].invoiceDO.isPaid) {
                return true;
            }
        }
        return false;
    }
}