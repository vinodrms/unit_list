import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ConfigCapacityComponent} from '../../../../../../../../../../../common/utils/components/ConfigCapacityComponent';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {BookingCartItemVM} from '../../../../services/search/view-models/BookingCartItemVM';
import {BookingControllerService} from '../../utils/BookingControllerService';
import {CustomerDO} from '../../../../../../../../../services/customers/data-objects/CustomerDO';
import {IBookingCustomerRegisterSelector} from '../../utils/IBookingCustomerRegister';
import {InvoicePaymentMethodVMGenerator} from '../../../../../../../../../services/invoices/view-models/utils/InvoicePaymentMethodVMGenerator';
import {InvoicePaymentMethodVM} from '../../../../../../../../../services/invoices/view-models/InvoicePaymentMethodVM';
import {InvoicePaymentMethodDO, InvoicePaymentMethodType} from '../../../../../../../../../services/invoices/data-objects/payers/InvoicePaymentMethodDO';

@Component({
    selector: 'booking-details-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-fill-details/components/template/booking-details-editor.html',
    directives: [CustomScroll, ConfigCapacityComponent],
    pipes: [TranslationPipe]
})
export class BookingDetailsEditorComponent extends BaseComponent {
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

    public addCustomer() {
        this._customerRegisterSelector.selectCustomerFromRegister().subscribe((selectedCustomer: CustomerDO) => {
            this._bookingCartItem.addCustomerIfNotExists(selectedCustomer);
            if (this._bookingCartItem.customerList.length == 1) {
                this.markBilledCustomer(selectedCustomer);
            }
            this.triggerBookingCartItemChange();
        });
    }
    public changeCustomer(previousCustomer: CustomerDO) {
        this._customerRegisterSelector.selectCustomerFromRegister().subscribe((selectedCustomer: CustomerDO) => {
            this._bookingCartItem.replaceCustomer(previousCustomer, selectedCustomer);
            if (this._bookingCartItem.transientBookingItem.defaultBillingDetails.customerId === previousCustomer.id) {
                this.markBilledCustomer(selectedCustomer);
            }
            this.triggerBookingCartItemChange();
        });
    }
    public markBilledCustomerFromTemplate(customer: CustomerDO) {
        this.markBilledCustomer(customer);
        this.triggerBookingCartItemChange();
    }
    private markBilledCustomer(customer: CustomerDO) {
        this._bookingCartItem.transientBookingItem.defaultBillingDetails.customerId = customer.id;
        this._bookingCartItem.customerNameString = customer.customerName;
        this.buildPaymentMethodVMList();
    }

    public didSelectBilledToCustomer(): boolean {
        return !this._appContext.thUtils.isUndefinedOrNull(this._bookingCartItem.transientBookingItem.defaultBillingDetails.customerId)
            && this._bookingCartItem.customerList.length > 0;
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

        if (!this.updateExistingPaymentMethodReference()) {
            this.setDefaultPaymentMethodReference();
        }
    }
    private updateExistingPaymentMethodReference(): boolean {
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
        var defaultPM = _.find(this.paymentMethodVMList, (pm: InvoicePaymentMethodVM) => { return pm.paymentMethod.type == InvoicePaymentMethodType.DefaultPaymentMethod; });
        if (defaultPM) {
            this._bookingCartItem.transientBookingItem.defaultBillingDetails.paymentMethod = defaultPM.paymentMethod;
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
    public get bookingNotes(): string {
        return this._bookingCartItem.transientBookingItem.notes;
    }
    public set bookingNotes(bookingNotes: string) {
        this._bookingCartItem.transientBookingItem.notes = bookingNotes;
    }

    private triggerBookingCartItemChange() {
        this.onBookingItemChanged.next(this._bookingCartItem);
    }
}