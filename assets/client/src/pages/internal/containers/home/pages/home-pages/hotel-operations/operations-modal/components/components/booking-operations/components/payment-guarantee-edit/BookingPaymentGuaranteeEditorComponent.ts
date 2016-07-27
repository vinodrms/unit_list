import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {EditSaveButtonGroupComponent} from '../../../../../../../../../../../../../common/utils/components/button-groups/EditSaveButtonGroupComponent';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingPaymentGuaranteeEditRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {DefaultBillingDetailsDO} from '../../../../../../../../../../../services/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import {InvoicePaymentMethodVMGenerator} from '../../../../../../../../../../../services/invoices/view-models/utils/InvoicePaymentMethodVMGenerator';
import {InvoicePaymentMethodVM} from '../../../../../../../../../../../services/invoices/view-models/InvoicePaymentMethodVM';
import {InvoicePaymentMethodDO} from '../../../../../../../../../../../services/invoices/data-objects/payers/InvoicePaymentMethodDO';

@Component({
    selector: 'booking-payment-guarantee-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/payment-guarantee-edit/template/booking-payment-guarantee-editor.html',
    directives: [EditSaveButtonGroupComponent],
    pipes: [TranslationPipe]
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
    private _paymentMethodDOCopy: InvoicePaymentMethodDO;

    constructor(private _appContext: AppContext,
        private _hotelOperationsBookingService: HotelOperationsBookingService) { }

    ngOnInit() {
        this._didInit = true;
        this.loadDependentData();
    }

    private loadDependentData() {
        if (!this._didInit || this._appContext.thUtils.isUndefinedOrNull(this._bookingOperationsPageData)) { return; }
        this.readonly = true;
        this.isSaving = false;
        var pmGenerator = new InvoicePaymentMethodVMGenerator(this._bookingOperationsPageData.hotelPaymentMethods);
        var billableCustomerId = this.defaultBillingDetailsDO.customerId;
        var billableCustomer = this._bookingOperationsPageData.customersContainer.getCustomerById(billableCustomerId);
        this.paymentMethodVMList = pmGenerator.generatePaymentMethodsFor(billableCustomer);
        this.updateSelectedPaymentMethod();
    }
    private updateSelectedPaymentMethod() {
        if (!this.hasPaymentGuarantee) {
            this.setDefaultPaymentMethod();
            return;
        }
        var foundPaymentMethodVM = _.find(this.paymentMethodVMList, (pm: InvoicePaymentMethodVM) => {
            return pm.paymentMethod.type === this.defaultBillingDetailsDO.paymentMethod.type && pm.paymentMethod.value === this.defaultBillingDetailsDO.paymentMethod.value;
        });
        if (this._appContext.thUtils.isUndefinedOrNull(foundPaymentMethodVM)) {
            this.setDefaultPaymentMethod();
            return;
        }
        this.selectedPaymentMethodVM = foundPaymentMethodVM;
    }
    private setDefaultPaymentMethod() {
        this.selectedPaymentMethodVM = this.paymentMethodVMList[0];
    }

    public get hasPaymentGuaranteeEditAccess(): boolean {
        return this._bookingOperationsPageData.bookingMeta.paymentGuaranteeEditRight === BookingPaymentGuaranteeEditRight.EditPaymentGuarantee;
    }
    public get bookingDO(): BookingDO {
        return this._bookingOperationsPageData.bookingDO;
    }
    public get defaultBillingDetailsDO(): DefaultBillingDetailsDO {
        return this.bookingDO.defaultBillingDetails;
    }
    public get hasPaymentGuarantee(): boolean {
        return this.bookingDO.defaultBillingDetails.paymentGuarantee;
    }
    public get buttonChangeText(): string {
        if (!this.hasPaymentGuarantee) { return "Add"; }
        return "Change";
    }

    public startEdit() {
        if (!this.hasPaymentGuaranteeEditAccess) { return; };
        this.readonly = false;
        this._paymentMethodDOCopy = this.selectedPaymentMethodVM.paymentMethod.buildPrototype();
    }
    public endEdit() {
        this.readonly = true;
        this.selectedPaymentMethodVM = _.find(this.paymentMethodVMList, (pm: InvoicePaymentMethodVM) => {
            return pm.paymentMethod.isSame(this._paymentMethodDOCopy);
        });
    }
    public savePaymentGuarantee() {
        if (!this.hasPaymentGuaranteeEditAccess || this._paymentMethodDOCopy.isSame(this.selectedPaymentMethodVM.paymentMethod)) {
            this.endEdit();
            return;
        }
        this.isSaving = true;
        this._hotelOperationsBookingService.addPaymentGuarantee(this.bookingDO, this.selectedPaymentMethodVM.paymentMethod).subscribe((updatedBooking: BookingDO) => {
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnBookingPaymentGuaranteeChanged(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}