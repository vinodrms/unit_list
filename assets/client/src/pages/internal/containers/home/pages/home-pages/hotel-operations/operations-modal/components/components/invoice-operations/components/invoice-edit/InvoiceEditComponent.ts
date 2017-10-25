import _ = require('underscore');
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { InvoiceVM } from '../../../../../../../../../../../services/invoices/view-models/InvoiceVM';
import { CustomerDO } from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {
    InvoiceAddPaymentsRight, InvoiceEditPayersRight, InvoiceReinstateRight, InvoiceDownloadRight, InvoicePayRight,
    InvoiceSetAsLossAcceptedByManagementRight, InvoiceEditItemsRight, InvoiceTransferRight
} from '../../../../../../../../../../../services/invoices/data-objects/InvoiceEditRights';
import { AddInvoicePaymentModalService } from '../invoice-overview/modal/services/AddInvoicePaymentModalService';
import { InvoiceOperationsPageData } from '../../utils/InvoiceOperationsPageData';
import { ModalDialogRef } from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { InvoicePaymentDO } from '../../../../../../../../../../../services/invoices/data-objects/payer/InvoicePaymentDO';
import { InvoiceChangedOptions } from '../invoice-overview/InvoiceOverviewComponent';
import { InvoicePaymentMethodVMGenerator } from '../../../../../../../../../../../services/invoices/view-models/utils/InvoicePaymentMethodVMGenerator';
import { InvoiceMetaFactory } from '../../../../../../../../../../../services/invoices/data-objects/InvoiceMetaFactory';
import { NumberOfAddOnProductsModalService } from '../../../../../../../../../../common/inventory/add-on-products/modals/services/NumberOfAddOnProductsModalService';
import { AddOnProductsModalService } from '../../../../../../../../../../common/inventory/add-on-products/modals/services/AddOnProductsModalService';
import { HotelOperationsInvoiceService } from '../../../../../../../../../../../services/hotel-operations/invoice/HotelOperationsInvoiceService';
import { CustomerRegisterModalService } from '../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService';
import { HotelOperationsPageControllerService } from '../../../../services/HotelOperationsPageControllerService';
import { EmailSenderModalService } from '../../../../../../email-sender/services/EmailSenderModalService';
import { AddInvoicePayerNotesModalService } from '../invoice-overview/modal/services/AddInvoicePayerNotesModalService';
import { ViewInvoiceHistoryModalService } from '../invoice-overview/modal/services/ViewInvoiceHistoryModalService';
import { InvoiceDO } from '../../../../../../../../../../../services/invoices/data-objects/InvoiceDO';
import { AddOnProductDO } from '../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import { NumberOfAddOnProductsModalOutput } from '../../../../../../../../../../common/inventory/add-on-products/modals/services/utils/NumberOfAddOnProductsModalOutput';
import { AddOnProductInvoiceItemMetaDO } from '../../../../../../../../../../../services/invoices/data-objects/items/add-on-products/AddOnProductInvoiceItemMetaDO';
import { InvoiceItemDO, InvoiceItemType } from '../../../../../../../../../../../services/invoices/data-objects/items/InvoiceItemDO';
import { InvoicePayerDO } from '../../../../../../../../../../../services/invoices/data-objects/payer/InvoicePayerDO';
import { InvoicePaymentMethodVM } from '../../../../../../../../../../../services/invoices/view-models/InvoicePaymentMethodVM';
import { InvoiceItemVM } from '../../../../../../../../../../../services/invoices/view-models/InvoiceItemVM';

@Component({
    selector: 'invoice-edit',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-edit/template/invoice-edit.html',
    providers: [NumberOfAddOnProductsModalService, AddOnProductsModalService, CustomerRegisterModalService, AddInvoicePaymentModalService,
        EmailSenderModalService, AddInvoicePayerNotesModalService]
})
export class InvoiceEditComponent implements OnInit {
    @Input() invoiceVM: InvoiceVM;
    @Input() invoiceOperationsPageData: InvoiceOperationsPageData;

    @Output() invoiceChanged = new EventEmitter<InvoiceChangedOptions>();
    public emitInvoiceChanged(options: InvoiceChangedOptions = { reloadInvoiceGroup: false }) {
        this.invoiceChanged.emit(options);
    }

    @Output() showInvoiceTransferRequested = new EventEmitter<string>();

    private pmGenerator: InvoicePaymentMethodVMGenerator;
    private invoiceMetaFactory: InvoiceMetaFactory;
    private lossByManagementPending: boolean;
    private payPending: boolean;
    private reinstatePending: boolean;

    constructor(private context: AppContext,
        private numberOfAddOnProductsModalService: NumberOfAddOnProductsModalService,
        private addOnProductsModalService: AddOnProductsModalService,
        private invoiceOperations: HotelOperationsInvoiceService,
        private customerRegisterModalService: CustomerRegisterModalService,
        private addInvoicePaymentModalService: AddInvoicePaymentModalService,
        private operationsPageControllerService: HotelOperationsPageControllerService,
        private emailSenderModalService: EmailSenderModalService,
        private addInvoicePayerNotesModalService: AddInvoicePayerNotesModalService,
        private viewInvoiceHistoryModalService: ViewInvoiceHistoryModalService
    ) {
        this.invoiceMetaFactory = new InvoiceMetaFactory();
        this.lossByManagementPending = false;
        this.payPending = false;
        this.reinstatePending = false;
    }
    public ngOnInit() {
        this.pmGenerator = new InvoicePaymentMethodVMGenerator(this.invoiceOperationsPageData.allowedPaymentMethods);
    }

    public invoiceAmountsMatch(): boolean {
        return this.invoiceVM.invoice.amountToPay === this.invoiceVM.invoice.amountPaid;
    }
    public invoiceHasItems(): boolean {
        return this.invoiceVM.invoice.itemList.length > 0;
    }
    public hasInvoicePayRight(): boolean {
        return this.invoiceVM.invoiceMeta.invoicePayRight === InvoicePayRight.Edit;
    }
    public hasInvoiceSetAsLossAcceptedByManagementRight(): boolean {
        return this.invoiceVM.invoiceMeta.invoiceSetAsLossAcceptedByManagementRight === InvoiceSetAsLossAcceptedByManagementRight.Edit;
    }
    public hasInvoiceEditItemsRight(): boolean {
        return this.invoiceVM.invoiceMeta.invoiceEditItemsRight === InvoiceEditItemsRight.Edit;
    }
    public hasInvoiceDownloadRight(): boolean {
        return this.invoiceVM.invoiceMeta.invoiceDownloadRight === InvoiceDownloadRight.Available;
    }
    public hasInvoiceTransferRight(): boolean {
        return this.invoiceVM.invoiceMeta.invoiceTransferRight === InvoiceTransferRight.Edit;
    }
    public hasInvoiceAddPaymentsRight(): boolean {
        return this.invoiceVM.invoiceMeta.invoiceAddPaymentsRight === InvoiceAddPaymentsRight.Edit;
    }
    public hasInvoiceEditPayersRight(): boolean {
        return this.invoiceVM.invoiceMeta.invoiceEditPayersRight === InvoiceEditPayersRight.Edit;
    }
    public hasInvoiceReinstateRight(): boolean {
        return this.invoiceVM.invoiceMeta.invoiceReinstateRight === InvoiceReinstateRight.Edit;
    }
    public canCreateWalkInInvoices(customer: CustomerDO): boolean {
        return customer.canCreateWalkInInvoices();
    }
    public canMoveItemsToNewInvoice(customer: CustomerDO): boolean {
        return this.canCreateWalkInInvoices(customer) && this.invoiceVM.hasMovableItems()
            && this.hasInvoiceEditItemsRight();
    }

    public onPayInvoice() {
        if (this.payPending) { return; }
        this.confirm("Paid", () => {
            this.payPending = true;
            this.invoiceOperations.markAsPaid(this.invoiceVM.invoice).subscribe((updatedInvoice: InvoiceDO) => {
                this.invoiceVM.invoice = updatedInvoice;
                this.invoiceVM.invoiceMeta = this.invoiceMetaFactory.getInvoiceMeta(this.invoiceVM.invoice.paymentStatus, this.invoiceVM.invoice.accountingType);
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
            this.invoiceOperations.markAsLossByManagemnt(this.invoiceVM.invoice).subscribe((updatedInvoice: InvoiceDO) => {
                this.invoiceVM.invoice = updatedInvoice;
                this.invoiceVM.invoiceMeta = this.invoiceMetaFactory.getInvoiceMeta(this.invoiceVM.invoice.paymentStatus, this.invoiceVM.invoice.accountingType);
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
            this.invoiceOperations.reinstate(this.invoiceVM.invoice)
                .subscribe((invoices: InvoiceDO[]) => {
                    this.emitInvoiceChanged({
                        reloadInvoiceGroup: true,
                        selectedInvoiceId: this.invoiceVM.invoice.id
                    });
                    this.reinstatePending = false;
                    this.context.analytics.logEvent("invoice", "reinstate", "Reinstated an invoice");
                }, (err: ThError) => {
                    this.reinstatePending = false;
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

    public openCustomerSelectModal() {
        this.customerRegisterModalService.openCustomerRegisterModal(false).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                let selectedCustomer = selectedCustomerList[0];

                if (this.invoiceVM.invoice.isWalkInInvoice() && !selectedCustomer.canCreateWalkInInvoices()) {
                    let errorMessage = this.context.thTranslation.translate("You cannot create walk in invoices for customers with Pay Invoice By Agreement enabled.");
                    this.context.toaster.error(errorMessage);
                    return;
                }
                this.invoiceOperations.addPayer(this.invoiceVM.invoice, selectedCustomer.id).subscribe((updatedInvoice: InvoiceDO) => {
                    this.invoiceVM.invoice = updatedInvoice;
                    this.invoiceVM.addCustomer(selectedCustomer);
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
        this.invoiceOperations.removePayer(this.invoiceVM.invoice, customer.id).subscribe((updatedInvoice: InvoiceDO) => {
            this.invoiceVM.invoice = updatedInvoice;
            this.invoiceVM.removeCustomer(customer.id);
            this.emitInvoiceChanged();
            this.context.analytics.logEvent("invoice", "remove-payer", "Removed a payer from an invoice");
        }, (err: ThError) => {
            this.context.toaster.error(err.message);
        });
    }

    public openAddOnProductSelectModal() {
        this.addOnProductsModalService.openAddOnProductsModal(false).then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
                if (!_.isEmpty(selectedAddOnProductList)) {
                    this.numberOfAddOnProductsModalService.openModal(selectedAddOnProductList[0].id).then((modalDialogInstance: ModalDialogRef<NumberOfAddOnProductsModalOutput>) => {
                        modalDialogInstance.resultObservable.subscribe((numberOfAopSelection: NumberOfAddOnProductsModalOutput) => {
                            var invoiceItem = this.buildInvoiceItemDOFromAddOnProductDO(selectedAddOnProductList[0], numberOfAopSelection.noOfItems);
                            this.invoiceOperations.addItem(this.invoiceVM.invoice, invoiceItem)
                                .subscribe((updatedInvoice: InvoiceDO) => {
                                    this.invoiceVM.invoice = updatedInvoice;
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

    private viewBooking(item: InvoiceItemVM) {
        if (!item.bookingId) { return; }
        this.operationsPageControllerService.goToBooking(item.bookingId);
    }

    public openAddInvoicePaymentModal(customer: CustomerDO) {
        if (this.invoiceVM.invoice.itemList.length == 0) {
            let errorMessage = this.context.thTranslation.translate("Please add at least one item before making a payment.");
            this.context.toaster.error(errorMessage);
            return;
        }
        this.addInvoicePaymentModalService.openAddInvoicePaymentModal(this.invoiceVM.invoice, customer, this.invoiceOperationsPageData).then((modalDialogInstance: ModalDialogRef<InvoicePaymentDO>) => {
            modalDialogInstance.resultObservable.subscribe((invoicePayment: InvoicePaymentDO) => {
                this.addPayment(customer.id, invoicePayment);
                this.emitInvoiceChanged();
            });
        }).catch((e: any) => { });
    }
    public addPayment(customerId: string, invoicePayment: InvoicePaymentDO) {
        this.invoiceOperations.addPayment(this.invoiceVM.invoice, customerId, invoicePayment).subscribe((updatedInvoice: InvoiceDO) => {
            this.invoiceVM.invoice = updatedInvoice;
            this.emitInvoiceChanged();
            this.context.analytics.logEvent("invoice", "add-payment", "Added a payment on an invoice");
        }, (err: ThError) => {
            this.context.toaster.error(err.message);
        });
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
            + this.invoiceVM.invoice.id
            + '&customerId=' + payer.id
            + '&token=' + accessToken;
    }
    public sendInvoiceConfirmation(customer: CustomerDO) {
        this.emailSenderModalService.sendInvoiceConfirmation([customer],
            this.invoiceVM.invoice.id,
            customer.id)
            .then((modalDialogRef: ModalDialogRef<boolean>) => {
                modalDialogRef.resultObservable.subscribe((sendResult: boolean) => {
                    this.context.analytics.logEvent("invoice", "send-confirmation", "Sent an invoice confirmation by email");
                    this.emitInvoiceChanged({ selectedInvoiceId: this.invoiceVM.invoice.id, reloadInvoiceGroup: true });
                }, (err: any) => { });
            }).catch((err: any) => { });
    }

    public createInvoiceForPayer(customer: CustomerDO) {
        this.operationsPageControllerService.goToInvoice(null, customer.id);
        let message = this.context.thTranslation.translate("A new invoice for %customer% has been created. You have been moved automatically to this invoice.", {
            customer: customer.customerName
        })
        this.context.toaster.info(message);
    }

    public openAddPayerNotesModal(customer: CustomerDO) {
        var payer: InvoicePayerDO = _.find(this.invoiceVM.invoice.payerList, (payer: InvoicePayerDO) => { return payer.customerId === customer.id });

        this.addInvoicePayerNotesModalService.openAddInvoicePayerNotesModal(payer.notes).then((modalDialogInstance: ModalDialogRef<string>) => {
            modalDialogInstance.resultObservable.subscribe((notes: string) => {
                this.invoiceOperations.addPayerNotes(this.invoiceVM.invoice, payer.customerId, notes)
                    .subscribe((updatedInvoice: InvoiceDO) => {
                        this.invoiceVM.invoice = updatedInvoice;
                        this.emitInvoiceChanged();
                    });
            });
        }).catch((e: any) => { });
    }

    public openTransferPageWithNewInvoice(customer: CustomerDO) {
        this.showInvoiceTransferRequested.emit(customer.id);
    }

    public get ccySymbol(): string {
        return this.invoiceOperationsPageData.ccy.symbol;
    }

    public getPaymentMethodDisplayName(payer: InvoicePayerDO, payment: InvoicePaymentDO): string {
        let customer = this.invoiceVM.getCustomerDO(payer.customerId);
        var invoicePaymentMethodVM: InvoicePaymentMethodVM = this.pmGenerator.generateInvoicePaymentMethodVMForPaymentMethod(payment.paymentMethod,
            this.invoiceOperationsPageData.allPaymentMethods, customer);
        return invoicePaymentMethodVM ? invoicePaymentMethodVM.displayName : "";
    }

    private getTitle(item: InvoiceItemVM): string {
        if (!item.bookingId) {
            return item.getDisplayName(this.context.thTranslation);
        }
        return this.context.thTranslation.translate("Click to View Booking");
    }

    public getInvoiceItemDisplayName(itemVm: InvoiceItemVM): string {
        return itemVm.getDisplayName(this.context.thTranslation);
    }

    public hasNotes(customer: CustomerDO): boolean {
        var invoicePayer: InvoicePayerDO = _.find(this.invoiceVM.invoice.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId === customer.id;
        });
        return !this.context.thUtils.isUndefinedOrNull(invoicePayer.notes);
    }

    public getPayerNotes(customer: CustomerDO): string {
        var invoicePayer: InvoicePayerDO = _.find(this.invoiceVM.invoice.payerList, (payer: InvoicePayerDO) => {
            return payer.customerId === customer.id;
        });
        return invoicePayer.notes;
    }

    public get payerList(): CustomerDO[] {
        return this.invoiceVM.customerList;
    }
}
