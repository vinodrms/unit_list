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
    InvoiceRemoveRight, InvoiceEditPayersRight, InvoiceReinstateRight, InvoiceDownloadRight, InvoiceTransferRight

} from "../../../../../../../../../../../services/invoices/data-objects/InvoiceEditRights";
import { InvoiceMetaFactory } from "../../../../../../../../../../../services/invoices/data-objects/InvoiceMetaFactory";
import { AddInvoicePaymentModalService } from "./modal/services/AddInvoicePaymentModalService";
import { HotelOperationsPageControllerService } from "../../../../services/HotelOperationsPageControllerService";
import { InvoiceItemVM } from "../../../../../../../../../../../services/invoices/view-models/InvoiceItemVM";
import { ThServerApi } from "../../../../../../../../../../../../../common/utils/http/ThServerApi";
import { PaginationOptions } from "../../utils/PaginationOptions";
import { EmailSenderModalService } from '../../../../../../email-sender/services/EmailSenderModalService';

export interface InvoiceChangedOptions {
    reloadInvoiceGroup: boolean;
    selectedInvoiceId?: string;
}

@Component({
    selector: 'invoice-overview',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-overview/template/invoice-overview.html',
    providers: [CustomerRegisterModalService, HotelOperationsInvoiceService, NumberOfAddOnProductsModalService, AddOnProductsModalService, AddInvoicePaymentModalService, EmailSenderModalService]
})
export class InvoiceOverviewComponent implements OnInit {

    @Input() relatedInvoices: InvoiceVM[];
    @Input() currentRelatedInvoiceIndex: number;
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;
    @Input() paginationOptions: PaginationOptions;
    @Output() showRelatedInvoicesClicked = new EventEmitter();
    @Output() showInvoiceTransferClicked = new EventEmitter();
    @Output() currentInvoiceChanged = new EventEmitter();
    @Output() invoiceChanged = new EventEmitter<InvoiceChangedOptions>();
    @Output() invoiceDeleted = new EventEmitter();

    private pmGenerator: InvoicePaymentMethodVMGenerator;
    private invoiceMetaFactory: InvoiceMetaFactory;
    private lossByManagementPending: boolean;
    private payPending: boolean;
    private reinstatePending: boolean;
    private deletePending: boolean;

    constructor(private context: AppContext,
        private numberOfAddOnProductsModalService: NumberOfAddOnProductsModalService,
        private addOnProductsModalService: AddOnProductsModalService,
        private invoiceOperations: HotelOperationsInvoiceService,
        private customerRegisterModalService: CustomerRegisterModalService,
        private addInvoicePaymentModalService: AddInvoicePaymentModalService,
        private operationsPageControllerService: HotelOperationsPageControllerService,
        private emailSenderModalService: EmailSenderModalService,
    ) {
        this.invoiceMetaFactory = new InvoiceMetaFactory();
        this.lossByManagementPending = false;
        this.payPending = false;
        this.reinstatePending = false;
    }

    ngOnInit() {
        this.pmGenerator = new InvoicePaymentMethodVMGenerator(this.invoiceOperationsPageData.allowedPaymentMethods);
    }

    public onPayInvoice() {
        if (this.payPending) { return; }
        this.confirm("Paid", () => {
            this.payPending = true;
            this.invoiceOperations.markAsPaid(this.currentInvoice.invoice).subscribe((updatedInvoice: InvoiceDO) => {
                this.currentInvoice.invoice = updatedInvoice;
                this.currentInvoice.invoiceMeta = this.invoiceMetaFactory.getInvoiceMeta(this.currentInvoice.invoice.paymentStatus, this.currentInvoice.invoice.accountingType);
                this.emitInvoiceChanged();
                this.payPending = false;
                this.context.analytics.logEvent("invoice", "paid", "Marked as Paid an invoice");
            }, (err: ThError) => {
                this.payPending = false;
                this.context.toaster.error(err.message);
            });
        });
    }

    public onLossByManagementInvoice() {
        if (this.lossByManagementPending) { return; }
        this.confirm("Loss By Management", () => {
            this.lossByManagementPending = true;
            this.invoiceOperations.markAsLossByManagemnt(this.currentInvoice.invoice).subscribe((updatedInvoice: InvoiceDO) => {
                this.currentInvoice.invoice = updatedInvoice;
                this.currentInvoice.invoiceMeta = this.invoiceMetaFactory.getInvoiceMeta(this.currentInvoice.invoice.paymentStatus, this.currentInvoice.invoice.accountingType);
                this.emitInvoiceChanged();
                this.lossByManagementPending = false;
                this.context.analytics.logEvent("invoice", "loss-by-management", "Marked as Loss By Management an invoice");
            }, (err: ThError) => {
                this.lossByManagementPending = false;
                this.context.toaster.error(err.message);
            });
        });
    }

    public onReinstateInvoice() {
        if (this.reinstatePending) { return; }
        let content = this.context.thTranslation.translate("Are you sure you want to reinstate this invoice?");
        this.confirm("Reinstate Invoice", () => {
            this.reinstatePending = true;
            this.invoiceOperations.reinstate(this.currentInvoice.invoice)
                .subscribe((invoices: InvoiceDO[]) => {
                    this.emitInvoiceChanged({
                        reloadInvoiceGroup: true,
                        selectedInvoiceId: this.currentInvoice.invoice.id
                    });
                    this.reinstatePending = false;
                    this.context.analytics.logEvent("invoice", "reinstate", "Reinstated an invoice");
                }, (err: ThError) => {
                    this.reinstatePending = false;
                    this.context.toaster.error(err.message);
                });
        }, content);
    }

    public onDeleteInvoice() {
        if (this.deletePending) { return; }
        let content = this.context.thTranslation.translate("Are you sure you want to delete this invoice?");
        this.confirm("Delete Invoice", () => {
            this.deletePending = true;
            this.invoiceOperations.delete(this.currentInvoice.invoice)
                .subscribe((invoice: InvoiceDO) => {
                    this.emitInvoiceChanged({
                        reloadInvoiceGroup: true,
                        selectedInvoiceId: this.currentInvoice.invoice.id
                    });
                    this.deletePending = false;
                    this.context.analytics.logEvent("invoice", "delete", "Deleted an invoice");
                    this.context.toaster.success("The invoice was deleted.");
                    this.emitInvoiceDeleted();

                }, (err: ThError) => {
                    this.deletePending = false;
                    this.context.toaster.error(err.message);
                });
        }, content);
    }

    private confirm(status: string, onConfirm: (() => void), content: string = null) {
        var title = this.context.thTranslation.translate("Info");
        let translatedStatus = this.context.thTranslation.translate(status);
        if (!content) {
            content = this.context.thTranslation.translate("Are you sure you want to mark this invoice as %status%?", { status: translatedStatus });
        }
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
                    this.context.analytics.logEvent("invoice", "add-payer", "Added a payer on an invoice");
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
            this.context.analytics.logEvent("invoice", "remove-payer", "Removed a payer from an invoice");
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
                                    this.context.analytics.logEvent("invoice", "add-item", "Added an item on an invoice");
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
    public hasInvoiceDownloadRight(): boolean {
        return this.currentInvoice.invoiceMeta.invoiceDownloadRight === InvoiceDownloadRight.Available;
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
            this.context.analytics.logEvent("invoice", "add-payment", "Added a payment on an invoice");
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

    public emitInvoiceChanged(options: InvoiceChangedOptions = { reloadInvoiceGroup: false }) {
        this.invoiceChanged.emit(options);
    }

    public emitInvoiceDeleted() {
        this.invoiceDeleted.emit();
    }

    public downloadInvoice(payer: CustomerDO) {
        window.open(this.getInvoicePdfUrl(payer), '_blank');
        this.context.analytics.logEvent("invoice", "download", "Downloaded an invoice");
    }
    
    private getInvoicePdfUrl(payer: CustomerDO): string {
        let payerIndex: number = _.findIndex(this.payerList, (item: CustomerDO) => {
            return payer.id === item.id;
        });
        let accessToken = this.context.tokenService.accessToken;
        return 'api/invoices/download?invoiceId='
            + this.currentInvoice.invoice.id
            + '&customerId=' + payer.id
            + '&token=' + accessToken;
    }
    public sendInvoiceConfirmation(customer: CustomerDO) {
        this.emailSenderModalService.sendInvoiceConfirmation([customer],
            this.currentInvoice.invoice.id,
            customer.id)
            .then((modalDialogRef: ModalDialogRef<boolean>) => {
                modalDialogRef.resultObservable.subscribe((sendResult: boolean) => {
                    this.context.analytics.logEvent("invoice", "send-confirmation", "Sent an invoice confirmation by email");
                }, (err: any) => { });
            }).catch((err: any) => { });
    }

    public createInvoiceForPayer(customer: CustomerDO) {
        this.operationsPageControllerService.goToInvoice(null, customer.id);
    }

    public canCreateWalkInInvoices(customer: CustomerDO): boolean {
        return customer.canCreateWalkInInvoices();
    }
}
