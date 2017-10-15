import * as _ from "underscore";
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppContext, ThError } from '../../../../../../../../../../../../../common/utils/AppContext';
import { BookingOperationsPageData } from '../../services/utils/BookingOperationsPageData';
import { BookingPaymentGuaranteeEditRight } from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import { BookingDO } from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import { DefaultBillingDetailsDO } from '../../../../../../../../../../../services/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import { HotelOperationsBookingService } from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import { CustomerDO } from "../../../../../../../../../../../services/customers/data-objects/CustomerDO";
import { ModalDialogRef } from "../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef";
import { HotelOperationsPageControllerService } from "../../../../services/HotelOperationsPageControllerService";
import { InvoicePaymentMethodVM } from "../../../../../../../../../../../services/invoices/view-models/InvoicePaymentMethodVM";
import { InvoicePaymentMethodVMGenerator } from "../../../../../../../../../../../services/invoices/view-models/utils/InvoicePaymentMethodVMGenerator";

@Component({
    selector: 'booking-payment-guarantee-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/payment-guarantee-edit/template/booking-payment-guarantee-editor.html'
})
export class BookingPaymentGuaranteeEditorComponent implements OnInit {
    @Output() onBookingPaymentGuaranteeChanged = new EventEmitter<BookingDO>();
    public triggerOnBookingPaymentGuaranteeChanged(updatedBooking: BookingDO) {
        this.onBookingPaymentGuaranteeChanged.next(updatedBooking);
    }

    private _bookingOperationsPageData: BookingOperationsPageData;
    public get bookingOperationsPageData(): BookingOperationsPageData {
        return this._bookingOperationsPageData;
    }
    @Input()
    public set bookingOperationsPageData(bookingOperationsPageData: BookingOperationsPageData) {
        this._bookingOperationsPageData = bookingOperationsPageData;
        this.loadDependentData();
    }

    private _didInit: boolean = false;
    readonly: boolean = true;
    isSaving: boolean = false;

    paymentMethodVMList: InvoicePaymentMethodVM[] = [];
    selectedPaymentMethodVM: InvoicePaymentMethodVM;

    private _selectedPaymentMethodVMCopy: InvoicePaymentMethodVM;
    private _billedCustomer: CustomerDO;
    private _pmGenerator: InvoicePaymentMethodVMGenerator;

    constructor(private _appContext: AppContext,
        private _operationsPageControllerService: HotelOperationsPageControllerService,
        private _hotelOperationsBookingService: HotelOperationsBookingService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.readonly = true;
        this.isSaving = false;

        this._pmGenerator = new InvoicePaymentMethodVMGenerator(this._bookingOperationsPageData.allowedPaymentMethods);

        var billedCustomerId = this.defaultBillingDetailsDO.customerId;
        this._billedCustomer = this._bookingOperationsPageData.customersContainer.getCustomerById(billedCustomerId);

        this.paymentMethodVMList = this._pmGenerator.generatePaymentMethodsFor(this._billedCustomer);
        this.selectedPaymentMethodVM = this._pmGenerator.generateInvoicePaymentMethodVMForPaymentMethod(this.defaultBillingDetailsDO.paymentMethod,
            this._bookingOperationsPageData.allPaymentMethods, this._billedCustomer);
    }

    public get customerList(): CustomerDO[] {
        return this._bookingOperationsPageData.customersContainer.customerList;
    }
    public get billedCustomer(): CustomerDO {
        return this._billedCustomer;
    }
    public isBilledCustomer(customer: CustomerDO): boolean {
        return customer.id === this.billedCustomer.id;
    }
    public get hasPaymentGuaranteeEditAccess(): boolean {
        return this._bookingOperationsPageData.bookingMeta.paymentGuaranteeEditRight === BookingPaymentGuaranteeEditRight.Edit;
    }
    public get hasPaymentGuarantee(): boolean {
        return this.defaultBillingDetailsDO.paymentGuarantee && !this._appContext.thUtils.isUndefinedOrNull(this.defaultBillingDetailsDO.paymentMethod);
    }

    public get bookingDO(): BookingDO {
        return this._bookingOperationsPageData.bookingDO;
    }
    public get defaultBillingDetailsDO(): DefaultBillingDetailsDO {
        return this.bookingDO.defaultBillingDetails;
    }

    public get buttonChangeText(): string {
        return "Change";
    }

    public onBilledCustomerSelectionChange(selectedCustomer: CustomerDO) {
        this._billedCustomer = selectedCustomer;
        this.paymentMethodVMList = this._pmGenerator.generatePaymentMethodsFor(this._billedCustomer);
        this.selectedPaymentMethodVM = this.paymentMethodVMList[0];
    }

    public goToCustomer(customer: CustomerDO) {
        this._operationsPageControllerService.goToCustomer(customer.id);
    }

    public startEdit() {
        if (!this.hasPaymentGuaranteeEditAccess) { return; };
        this.readonly = false;
        this._selectedPaymentMethodVMCopy = this.selectedPaymentMethodVM.buildPrototype();
        this.selectedPaymentMethodVM = _.find(this.paymentMethodVMList, (paymentMethodVM: InvoicePaymentMethodVM) => {
            return paymentMethodVM.paymentMethod.type === this.selectedPaymentMethodVM.paymentMethod.type &&
                paymentMethodVM.paymentMethod.value === this.selectedPaymentMethodVM.paymentMethod.value;
        });
        if (this._appContext.thUtils.isUndefinedOrNull(this.selectedPaymentMethodVM)) {
            this.selectedPaymentMethodVM = this.paymentMethodVMList[0];
        }
    }
    public endEdit() {
        this.readonly = true;
        this.selectedPaymentMethodVM = this._selectedPaymentMethodVMCopy;
    }
    public savePaymentGuarantee() {
        if (!this.hasPaymentGuaranteeEditAccess || !this.paymentGuaranteeHasChanged()) {
            this.endEdit();
            return;
        }
        this.isSaving = true;

        this._hotelOperationsBookingService.addPaymentGuarantee(this.bookingDO, this.billedCustomer, this.selectedPaymentMethodVM.paymentMethod).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("booking", "payment-guarantee", "Updated payment guarantee on a booking");
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnBookingPaymentGuaranteeChanged(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }

    private paymentGuaranteeHasChanged(): boolean {
        return !(this._selectedPaymentMethodVMCopy.paymentMethod.equals(this.selectedPaymentMethodVM.paymentMethod) && this.hasPaymentGuarantee) ||
            this.billedCustomer.id != this.bookingDO.defaultBillingDetails.customerId;
    }
}
