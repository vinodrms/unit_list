import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {BookingCartItemVM} from '../../../../services/search/view-models/BookingCartItemVM';
import {BookingControllerService} from '../../utils/BookingControllerService';
import {CustomerDO} from '../../../../../../../../../services/customers/data-objects/CustomerDO';
import {BookingDOConstraints} from '../../../../../../../../../services/bookings/data-objects/BookingDOConstraints';
import {IBookingCustomerRegisterSelector} from '../../utils/IBookingCustomerRegister';
import {InvoicePaymentMethodVMGenerator} from '../../../../../../../../../services/invoices/view-models/utils/InvoicePaymentMethodVMGenerator';
import {InvoicePaymentMethodVM} from '../../../../../../../../../services/invoices/view-models/InvoicePaymentMethodVM';
import { InvoicePaymentMethodDO, InvoicePaymentMethodType } from '../../../../../../../../../services/invoices/data-objects/payers/InvoicePaymentMethodDO';
import { TravelActivityType, TravelActivityTypeOption } from "../../../../../../../../../services/bookings/data-objects/BookingDO";

@Component({
    selector: 'new-booking-details-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-fill-details/components/template/new-booking-details-editor.html'
})
export class NewBookingDetailsEditorComponent extends BaseComponent {
    @Output() protected onBookingItemChanged = new EventEmitter<BookingCartItemVM>();

    private _bookingCartItem: BookingCartItemVM;
    public get bookingCartItem(): BookingCartItemVM {
        return this._bookingCartItem;
    }
    @Input()
    public set bookingCartItem(bookingCartItem: BookingCartItemVM) {
        if (!bookingCartItem) {
            return;
        }
        this._bookingCartItem = bookingCartItem;
        this.updateDependentData();
    }

    private _customerRegisterSelector: IBookingCustomerRegisterSelector;

    intervalString: string;
    noOfNights: number;
    madeThroughAllotment: boolean;
    paymentMethodVMList: InvoicePaymentMethodVM[] = [];

    constructor(private _appContext: AppContext, private _bookingControllerService: BookingControllerService) {
        super();
        this._customerRegisterSelector = _bookingControllerService;
    }

    private updateDependentData() {
        this.intervalString = this._bookingCartItem.bookingInterval.getLongDisplayString(this._appContext.thTranslation);
        this.noOfNights = this._bookingCartItem.bookingInterval.getNumberOfDays();
        this.madeThroughAllotment = true;
        if (this._appContext.thUtils.isUndefinedOrNull(this._bookingCartItem.transientBookingItem.allotmentId)) {
            this.madeThroughAllotment = false;
        }
        this.buildPaymentMethodVMList();
    }
    public isBilledCustomer(customer: CustomerDO): boolean {
        return this._bookingCartItem.transientBookingItem.defaultBillingDetails.customerId === customer.id;
    }
    protected canBeBilledCustomer(customer: CustomerDO): boolean {
        return customer.hasAccessOnPriceProduct(this._bookingCartItem.priceProduct) &&
            customer.customerDetails.canGuaranteePayment();
    }

    public addCustomer() {
        this.getAllowedCustomerFromRegister((selectedCustomer: CustomerDO) => {
            if (selectedCustomer.isCompanyOrTravelAgency() && this._bookingCartItem.getNumberOfCompaniesOrTravelAgencies() >= BookingDOConstraints.MaxNoOfCompaniesOrTravelAgenciesOnBooking) {
                var errorMessage = this._appContext.thTranslation.translate("You cannot have more than %noCompOrTa% Company or Travel Agent on a booking", { noCompOrTa: BookingDOConstraints.MaxNoOfCompaniesOrTravelAgenciesOnBooking });
                this._appContext.toaster.error(errorMessage);
                return;
            }
            this._bookingCartItem.addCustomerIfNotExists(selectedCustomer);
            if (!this.didSelectBilledToCustomer()) {
                this.updateBilledCustomer(selectedCustomer);
            }
            this.triggerBookingCartItemChange();
        });
    }
    public changeCustomer(previousCustomer: CustomerDO) {
        this.getAllowedCustomerFromRegister((selectedCustomer: CustomerDO) => {
            this._bookingCartItem.replaceCustomerIfNewOneNotExists(previousCustomer, selectedCustomer);
            if (this.isBilledCustomer(previousCustomer) || !this.didSelectBilledToCustomer()) {
                if (!this.updateBilledCustomer(selectedCustomer)) {
                    this._bookingCartItem.removeBilledToCustomer();
                }
            }
            this.triggerBookingCartItemChange();
        });
    }
    private getAllowedCustomerFromRegister(callback: { (selectedCustomer: CustomerDO): void }) {
        this._customerRegisterSelector.selectCustomerFromRegister().subscribe((selectedCustomer: CustomerDO) => {
            this._bookingCartItem.updateCustomerIfExists(selectedCustomer);

            if (!selectedCustomer.hasAccessOnPriceProduct(this._bookingCartItem.priceProduct)) {
                if (this.isBilledCustomer(selectedCustomer)) {
                    this._bookingCartItem.removeBilledToCustomer();
                }
                if (selectedCustomer.isCompanyOrTravelAgency()) {
                    var errorMessage = this._appContext.thTranslation.translate("%customerName% has no access on this price product", { customerName: selectedCustomer.customerName });
                    this._appContext.toaster.error(errorMessage);
                    return;
                }
            }
            callback(selectedCustomer);
        });
    }

    public updateBilledCustomerFromTemplate(customer: CustomerDO) {
        if (this.updateBilledCustomer(customer)) {
            this.triggerBookingCartItemChange();
        }
    }
    private updateBilledCustomer(customer: CustomerDO): boolean {
        if (!this.canBeBilledCustomer(customer)) {
            return false;
        }
        this._bookingCartItem.transientBookingItem.defaultBillingDetails.customerId = customer.id;
        this._bookingCartItem.customerNameString = customer.customerName;
        this.buildPaymentMethodVMList();
        return true;
    }

    public didSelectBilledToCustomer(): boolean {
        return this._bookingCartItem.didSelectBilledToCustomer();
    }
    public get paymentGuarantee(): boolean {
        return this._bookingCartItem.transientBookingItem.defaultBillingDetails.paymentGuarantee;
    }
    public set paymentGuarantee(paymentGuarantee: boolean) {
        this._bookingCartItem.transientBookingItem.defaultBillingDetails.paymentGuarantee = paymentGuarantee;
        this.buildPaymentMethodVMList();
        if (!paymentGuarantee) {
            this.setDefaultPaymentMethodReference();
        }
        this.triggerBookingCartItemChange();
    }
    public needsPaymentGuarantee(): boolean {
        return this._bookingCartItem.priceProduct.conditions.policy.hasCancellationPolicy();
    }

    private buildPaymentMethodVMList() {
        if (!this.didSelectBilledToCustomer()) {
            this.paymentMethodVMList = [];
            return;
        }
        var pmGenerator = new InvoicePaymentMethodVMGenerator(this._bookingCartItem.allowedPaymentMethods);
        var billableCustomerId = this._bookingCartItem.transientBookingItem.defaultBillingDetails.customerId;
        var billableCustomer = this._bookingCartItem.getCustomerById(billableCustomerId);
        this.paymentMethodVMList = pmGenerator.generatePaymentMethodsFor(billableCustomer);

        if (!this.updatePaymentMethodOnBookingIfFound() || billableCustomer.customerDetails.canPayInvoiceByAgreement()) {
            this.setDefaultPaymentMethodReference();
        }
    }

    private updatePaymentMethodOnBookingIfFound() {
        var paymentMethodToFind = this._bookingCartItem.transientBookingItem.defaultBillingDetails.paymentMethod;
        var foundPaymentMethodVM = _.find(this.paymentMethodVMList, (pm: InvoicePaymentMethodVM) => {
            return pm.paymentMethod.type === paymentMethodToFind.type && pm.paymentMethod.value === paymentMethodToFind.value;
        });
        if (foundPaymentMethodVM) {
            this._bookingCartItem.transientBookingItem.defaultBillingDetails.paymentMethod = foundPaymentMethodVM.paymentMethod;
            return true;
        }
        return false;
    }

    private setDefaultPaymentMethodReference(): boolean {
        if (this.paymentMethodVMList.length > 0) {
            this._bookingCartItem.transientBookingItem.defaultBillingDetails.paymentMethod = this.paymentMethodVMList[0].paymentMethod;
            return true;
        }
        return false;
    }

    public get paymentMethod(): InvoicePaymentMethodDO {
        return this._bookingCartItem.transientBookingItem.defaultBillingDetails.paymentMethod;
    }
    public set paymentMethod(paymentMethod: InvoicePaymentMethodDO) {
        this._bookingCartItem.transientBookingItem.defaultBillingDetails.paymentMethod = paymentMethod;
        this.triggerBookingCartItemChange();
    }
    
    public get externalBookingReference() : string {
        return this._bookingCartItem.transientBookingItem.externalBookingReference;
    }
    public set externalBookingReference(externalBookingReference : string) {
        this._bookingCartItem.transientBookingItem.externalBookingReference = externalBookingReference;
    }
    public get bookingNotes(): string {
        return this._bookingCartItem.transientBookingItem.notes;
    }
    public set bookingNotes(bookingNotes: string) {
        this._bookingCartItem.transientBookingItem.notes = bookingNotes;
    }
    public get invoiceNotes(): string {
        return this._bookingCartItem.transientBookingItem.invoiceNotes;
    }
    public set invoiceNotes(invoiceNotes: string) {
        this._bookingCartItem.transientBookingItem.invoiceNotes = invoiceNotes;
    }

    private triggerBookingCartItemChange() {
        this.onBookingItemChanged.next(this._bookingCartItem);
    }

    public get travelActivityTypeOptionList(): TravelActivityTypeOption[] {
        return TravelActivityTypeOption.getValues();
    }

    public get travelActivityType() : TravelActivityType {
        return this._bookingCartItem.transientBookingItem.travelActivityType;
    }
    public setTravelActivityType(travelActivityType: string) {
        debugger
        this._bookingCartItem.transientBookingItem.travelActivityType = parseInt(travelActivityType);
    }
}