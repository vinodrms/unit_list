import _ = require('underscore');
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AppContext, ThError } from "../../../../../../../../../../../../../common/utils/AppContext";
import { InvoiceVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceVM";
import { CustomerDO } from "../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { HotelOperationsInvoiceService } from "../../../../../../../../../../../services/hotel-operations/invoice/HotelOperationsInvoiceService";
import { InvoiceDO } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceDO";
import { ModalDialogRef } from "../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { CustomerRegisterModalService } from "../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService";
import { InvoiceOperationsPageData } from "../../utils/InvoiceOperationsPageData";
import { AddOnProductDO } from "../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO";
import { NumberOfAddOnProductsModalOutput } from "../../../../../../../../../../common/inventory/add-on-products/modals/services/utils/NumberOfAddOnProductsModalOutput";
import { AddOnProductsModalService } from "../../../../../../../../../../common/inventory/add-on-products/modals/services/AddOnProductsModalService";
import { NumberOfAddOnProductsModalService } from "../../../../../../../../../../common/inventory/add-on-products/modals/services/NumberOfAddOnProductsModalService";
import { InvoiceItemDO, InvoiceItemType } from "../../../../../../../../../../../services/invoices/data-objects/items/InvoiceItemDO";
import { AddOnProductInvoiceItemMetaDO } from "../../../../../../../../../../../services/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO";
import { InvoicePaymentDO } from "../../../../../../../../../../../services/invoices/data-objects/payer/InvoicePaymentDO";
import { InvoicePaymentMethodVMGenerator } from "../../../../../../../../../../../services/invoices/view-models/utils/InvoicePaymentMethodVMGenerator";
import { InvoicePaymentMethodVM } from "../../../../../../../../../../../services/invoices/view-models/InvoicePaymentMethodVM";
import {
    InvoicePayRight, InvoiceSetAsLossAcceptedByManagementRight, InvoiceEditItemsRight, InvoiceAddPaymentsRight,
    InvoiceRemoveRight, InvoiceEditPayersRight, InvoiceReinstateRight, InvoiceTransferRight

} from "../../../../../../../../../../../services/invoices/data-objects/InvoiceEditRights";
import { InvoiceMetaFactory } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceMetaFactory";
import { AddInvoicePaymentModalService } from "./modal/services/AddInvoicePaymentModalService";
import { HotelOperationsPageControllerService } from "../../../../services/HotelOperationsPageControllerService";
import { InvoiceItemVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceItemVM";


@Component({
    selector: 'invoice-overview',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-overview/template/invoice-overview.html',
    providers: [CustomerRegisterModalService, HotelOperationsInvoiceService, NumberOfAddOnProductsModalService, AddOnProductsModalService, AddInvoicePaymentModalService]
})
export class InvoiceOverviewComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVM[];
    @Input() currentRelatedInvoiceIndex: number;
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;
    @Output() showRelatedInvoicesClicked = new EventEmitter();
    @Output() showInvoiceTransferClicked = new EventEmitter();
    @Output() currentInvoiceChanged = new EventEmitter();
    @Output() invoiceChanged = new EventEmitter();


    private pmGenerator: InvoicePaymentMethodVMGenerator;
    private invoiceMetaFactory: InvoiceMetaFactory;

    constructor(private context: AppContext,
        private numberOfAddOnProductsModalService: NumberOfAddOnProductsModalService,
        private addOnProductsModalService: AddOnProductsModalService,
        private invoiceOperations: HotelOperationsInvoiceService,
        private customerRegisterModalService: CustomerRegisterModalService,
        private addInvoicePaymentModalService: AddInvoicePaymentModalService,
        private operationsPageControllerService: HotelOperationsPageControllerService,
    ) {
        this.invoiceMetaFactory = new InvoiceMetaFactory();
    }

    ngOnInit() {
        this.pmGenerator = new InvoicePaymentMethodVMGenerator(this.invoiceOperationsPageData.allowedPaymentMethods);
    }

    public onPayInvoice() {
        this.confirm("Paid", () => {
            this.invoiceOperations.markAsPaid(this.currentInvoice.invoice).subscribe((updatedInvoice: InvoiceDO) => {
                this.currentInvoice.invoice = updatedInvoice;
                this.currentInvoice.invoiceMeta = this.invoiceMetaFactory.getInvoiceMetaByPaymentStatus(this.currentInvoice.invoice.paymentStatus);
                this.emitInvoiceChanged();
            }, (err: ThError) => {
                this.context.toaster.error(err.message);
            });
        });
    }

    public onLossByManagementInvoice() {
        this.confirm("Loss By Management", () => {
            this.invoiceOperations.markAsLossByManagemnt(this.currentInvoice.invoice).subscribe((updatedInvoice: InvoiceDO) => {
                this.currentInvoice.invoice = updatedInvoice;
                this.currentInvoice.invoiceMeta = this.invoiceMetaFactory.getInvoiceMetaByPaymentStatus(this.currentInvoice.invoice.paymentStatus);
                this.emitInvoiceChanged();
            }, (err: ThError) => {
                this.context.toaster.error(err.message);
            });
        });
    }

    public onReinstateInvoice() {
        //TODO
    }

    private confirm(status: string, onConfirm: (() => void)) {
        var title = this.context.thTranslation.translate("Info");
        let translatedStatus = this.context.thTranslation.translate(status);
        var content = this.context.thTranslation.translate("Are you sure you want to mark this invoice as %status%?", { status: translatedStatus });
        var positiveLabel = this.context.thTranslation.translate("Yes");
        var negativeLabel = this.context.thTranslation.translate("No");
        this.context.modalService.confirm(title, content, { positive: positiveLabel, negative: negativeLabel }, () => {
            onConfirm();
        });
    }

    public moveToNextRelatedInvoice() {
        if (this.currentRelatedInvoiceIndex < this.relatedInvoices.length - 1) {
            this.currentRelatedInvoiceIndex++;
        } else {
            this.currentRelatedInvoiceIndex = 0;
        }
        this.currentInvoiceChanged.emit(this.currentRelatedInvoiceIndex);
    }

    public moveToPreviousRelatedInvoice() {
        if (this.currentRelatedInvoiceIndex > 0) {
            this.currentRelatedInvoiceIndex--;
        } else {
            this.currentRelatedInvoiceIndex = this.relatedInvoices.length - 1;
        }
        this.currentInvoiceChanged.emit(this.currentRelatedInvoiceIndex);
    }

    public get currentInvoice(): InvoiceVM {
        return this.relatedInvoices[this.currentRelatedInvoiceIndex];
    }

    public get payerList(): CustomerDO[] {
        return this.currentInvoice.customerList;
    }

    public showRelatedInvoices() {
        this.showRelatedInvoicesClicked.emit();
    }

    public showInvoiceTransfer() {
        this.showInvoiceTransferClicked.emit();
    }

    public openCustomerSelectModal() {
        this.customerRegisterModalService.openCustomerRegisterModal(false).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                let selectedCustomer = selectedCustomerList[0];

                if (this.currentInvoice.invoice.isWalkInInvoice() && !selectedCustomer.canCreateWalkInInvoices()) {
                    let errorMessage = this.context.thTranslation.translate("You cannot create walk in invoices for customers with Pay Invoice By Agreement enabled.");
                    this.context.toaster.error(errorMessage);
                    return;
                }
                this.invoiceOperations.addPayer(this.currentInvoice.invoice, selectedCustomer.id).subscribe((updatedInvoice: InvoiceDO) => {
                    this.currentInvoice.invoice = updatedInvoice;
                    this.currentInvoice.addCustomer(selectedCustomer);
                    this.emitInvoiceChanged();
                }, (err: ThError) => {
                    this.context.toaster.error(err.message);
                });
            });
        }).catch((e: any) => { });
    }

    public goToCustomer(customer: CustomerDO) {
        this.operationsPageControllerService.goToCustomer(customer.id);
    }

    public removePayer(customer: CustomerDO) {
        this.invoiceOperations.removePayer(this.currentInvoice.invoice, customer.id).subscribe((updatedInvoice: InvoiceDO) => {
            this.currentInvoice.invoice = updatedInvoice;
            this.currentInvoice.removeCustomer(customer.id);
            this.emitInvoiceChanged();
        }, (err: ThError) => {
            this.context.toaster.error(err.message);
        });
    }

    public get ccySymbol(): string {
        return this.invoiceOperationsPageData.ccy.symbol;
    }

    public openAddOnProductSelectModal() {
        this.addOnProductsModalService.openAddOnProductsModal(false).then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
                if (!_.isEmpty(selectedAddOnProductList)) {
                    this.numberOfAddOnProductsModalService.openModal(selectedAddOnProductList[0].id).then((modalDialogInstance: ModalDialogRef<NumberOfAddOnProductsModalOutput>) => {
                        modalDialogInstance.resultObservable.subscribe((numberOfAopSelection: NumberOfAddOnProductsModalOutput) => {
                            var invoiceItem = this.buildInvoiceItemDOFromAddOnProductDO(selectedAddOnProductList[0], numberOfAopSelection.noOfItems);
                            this.invoiceOperations.addItem(this.currentInvoice.invoice, invoiceItem)
                                .subscribe((updatedInvoice: InvoiceDO) => {
                                    this.currentInvoice.invoice = updatedInvoice;
                                    this.emitInvoiceChanged();
                                }, (err: ThError) => {
                                    this.context.toaster.error(err.message);
                                });
                        });
                    }).catch((e: any) => { });
                }
            });
        }).catch((e: any) => { });
    }

    public buildInvoiceItemDOFromAddOnProductDO(aop: AddOnProductDO, numberOfItems: number): InvoiceItemDO {
        var aopInvoiceItemMeta = new AddOnProductInvoiceItemMetaDO();
        aopInvoiceItemMeta.aopDisplayName = aop.name;
        aopInvoiceItemMeta.numberOfItems = numberOfItems;
        aopInvoiceItemMeta.pricePerItem = aop.price;
        aopInvoiceItemMeta.vatId = aop.getVatId();

        var invoiceItem = new InvoiceItemDO();
        invoiceItem.meta = aopInvoiceItemMeta;
        invoiceItem.type = InvoiceItemType.AddOnProduct;
        invoiceItem.id = aop.id;
        return invoiceItem;
    }

    public openRemoveItemConfirmationModal(item: InvoiceItemDO) {
        var removeInvoiceItemTitle = this.context.thTranslation.translate('Remove Item From Invoice');
        var removeInvoiceItemString = this.context.thTranslation.translate('Are you sure you want to remove %itemDisplayName% from the invoice?', { itemDisplayName: item.meta.getDisplayName(this.context.thTranslation) });
        this.context.modalService.confirm(removeInvoiceItemTitle, removeInvoiceItemString, { positive: this.context.thTranslation.translate("Yes"), negative: this.context.thTranslation.translate("No") },
            () => {
                this.removeItem(item);
            },
            () => {
                return;
            });
    }

    public removeItem(item: InvoiceItemDO) {
        this.invoiceOperations.removeItem(this.currentInvoice.invoice, item.transactionId).subscribe((updatedInvoice: InvoiceDO) => {
            this.currentInvoice.invoice = updatedInvoice;
            this.emitInvoiceChanged();
        }, (err: ThError) => {
            this.context.toaster.error(err.message);
        });
    }

    public getPaymentMethodDisplayName(payment: InvoicePaymentDO): string {
        var invoicePaymentMethodVM: InvoicePaymentMethodVM = this.pmGenerator.generateInvoicePaymentMethodVMForPaymentMethod(payment.paymentMethod, this.invoiceOperationsPageData.allPaymentMethods);
        return invoicePaymentMethodVM ? invoicePaymentMethodVM.displayName : "";
    }

    public hasInvoicePayRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoicePayRight === InvoicePayRight.Edit;
    }
    public hasInvoiceSetAsLossAcceptedByManagementRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceSetAsLossAcceptedByManagementRight === InvoiceSetAsLossAcceptedByManagementRight.Edit;
    }
    public hasInvoiceEditItemsRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceEditItemsRight === InvoiceEditItemsRight.Edit;
    }
    public hasInvoiceTransferRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceTransferRight === InvoiceTransferRight.Edit;
    }
    public hasBookings(): boolean {
        let item = this.getFirstBookingItem();
        return !this.context.thUtils.isUndefinedOrNull(item);
    }
    public viewFirstBooking() {
        let item = this.getFirstBookingItem();
        if (!this.context.thUtils.isUndefinedOrNull(item)) {
            this.operationsPageControllerService.goToBooking(item.id);
        }
    }
    private getFirstBookingItem(): InvoiceItemDO {
        return _.find(this.currentInvoice.invoice.itemList, (item: InvoiceItemDO) => {
            return item.type === InvoiceItemType.Booking;
        });
    }
    public hasItems(): boolean {
        return !_.isEmpty(this.currentInvoice.invoice.itemList);
    }

    public hasInvoiceAddPaymentsRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceAddPaymentsRight === InvoiceAddPaymentsRight.Edit;
    }
    public hasInvoiceRemoveRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceRemoveRight === InvoiceRemoveRight.Edit;
    }
    public hasInvoiceEditPayersRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceEditPayersRight === InvoiceEditPayersRight.Edit;
    }
    public hasInvoiceReinstateRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceReinstateRight === InvoiceReinstateRight.Edit;
    }

    public openAddInvoicePaymentModal(customer: CustomerDO) {
        if (this.currentInvoice.invoice.itemList.length == 0) {
            let errorMessage = this.context.thTranslation.translate("Please add at least one item before making a payment.");
            this.context.toaster.error(errorMessage);
            return;
        }
        this.addInvoicePaymentModalService.openAddInvoicePaymentModal(this.currentInvoice.invoice, customer, this.invoiceOperationsPageData).then((modalDialogInstance: ModalDialogRef<InvoicePaymentDO>) => {
            modalDialogInstance.resultObservable.subscribe((invoicePayment: InvoicePaymentDO) => {
                this.addPayment(customer.id, invoicePayment);
                this.emitInvoiceChanged();
            });
        }).catch((e: any) => { });
    }

    public addPayment(customerId: string, invoicePayment: InvoicePaymentDO) {
        this.invoiceOperations.addPayment(this.currentInvoice.invoice, customerId, invoicePayment).subscribe((updatedInvoice: InvoiceDO) => {
            this.currentInvoice.invoice = updatedInvoice;
            this.emitInvoiceChanged();
        }, (err: ThError) => {
            this.context.toaster.error(err.message);
        });
    }

    public isBookingItem(item: InvoiceItemDO): boolean {
        return item.type === InvoiceItemType.Booking;
    }

    public getInvoiceItemDisplayName(itemVm: InvoiceItemVM): string {
        return itemVm.getDisplayName(this.context.thTranslation);
    }

    public emitInvoiceChanged() {
        this.invoiceChanged.emit();
    }
}
