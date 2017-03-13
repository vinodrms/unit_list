import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {ModalDialogRef} from '../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {HotelOperationsPageControllerService} from '../../../../services/HotelOperationsPageControllerService';
import {BookingOperationsPageData} from '../../services/utils/BookingOperationsPageData';
import {BookingCustomerEditRight} from '../../../../../../../../../../../services/bookings/data-objects/BookingEditRights';
import {BookingDO} from '../../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {CustomerDO} from '../../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {CustomersDO} from '../../../../../../../../../../../services/customers/data-objects/CustomersDO';
import {HotelOperationsBookingService} from '../../../../../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import {CustomerRegisterModalService} from '../../../../../../../../../../common/inventory/customer-register/modal/services/CustomerRegisterModalService';

@Component({
    selector: 'booking-customer-editor',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/components/customers-edit/template/booking-customer-editor.html',
    providers: [CustomerRegisterModalService]
})
export class BookingCustomerEditorComponent implements OnInit {
    @Output() onCustomersChanged = new EventEmitter<BookingDO>();
    public triggerOnCustomersChanged(updatedBooking: BookingDO) {
        this.onCustomersChanged.next(updatedBooking);
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

    private _customersContainerCopy: CustomersDO;
    private _didMakeChanges: boolean = false;

    constructor(private _appContext: AppContext,
        private _customerRegisterModal: CustomerRegisterModalService,
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
    }
    public get bookingDO(): BookingDO {
        return this._bookingOperationsPageData.bookingDO;
    }
    public get customerContainer(): CustomersDO {
        return this._bookingOperationsPageData.customersContainer;
    }
    public get customerList(): CustomerDO[] {
        return this._bookingOperationsPageData.customersContainer.customerList;
    }

    public get hasCustomerEditRight(): boolean {
        return this._bookingOperationsPageData.bookingMeta.customerEditRight === BookingCustomerEditRight.Edit;
    }
    public isBilledCustomer(customer: CustomerDO): boolean {
        return this.bookingDO.defaultBillingDetails.customerId === customer.id;
    }
    public isDisplayedOnInvoiceAsGuest(customer: CustomerDO): boolean {
        return this.bookingDO.defaultBillingDetails.customerIdDisplayedAsGuest === customer.id;
    }
    public onSelectionChange(selectedCustomer: CustomerDO) {
        this.bookingDO.defaultBillingDetails.customerIdDisplayedAsGuest = selectedCustomer.id;
        this._didMakeChanges = true;
    }
    
    public goToCustomer(customer: CustomerDO) {
        this._operationsPageControllerService.goToCustomer(customer.id);
    }

    public startEdit() {
        if (!this.hasCustomerEditRight) { return; };
        this._customersContainerCopy = new CustomersDO();
        this._customersContainerCopy.customerList = _.map(this.customerList, (customer: CustomerDO) => { return customer });
        this._didMakeChanges = false;
        this.readonly = false;
    }

    public addCustomers() {
        this._customerRegisterModal.openCustomerRegisterModal(true).then((modalDialogInstance: ModalDialogRef<CustomerDO[]>) => {
            modalDialogInstance.resultObservable.subscribe((selectedCustomerList: CustomerDO[]) => {
                this.appendCustomerList(selectedCustomerList);
            });
        }).catch((e: any) => { });
    }
    private appendCustomerList(customerList: CustomerDO[]) {
        var didOmitCustomers: boolean = false;
        var omittedCustomerString: string = "";
        _.forEach(customerList, (customerToAppend: CustomerDO) => {
            if (customerToAppend.hasAccessOnPriceProduct(this.bookingDO.priceProductSnapshot) || customerToAppend.isIndividual()) {
                this.customerContainer.appendCustomer(customerToAppend);
                this._didMakeChanges = true;
            }
            else {
                didOmitCustomers = true;
                if (omittedCustomerString.length > 0) { omittedCustomerString += ", " };
                omittedCustomerString += customerToAppend.customerName;
            }
        });
        if (didOmitCustomers) {
            var errorMessage = this._appContext.thTranslation.translate("Some customers (%omittedCustomers%) have not been added because they do not have access on the price product", { omittedCustomers: omittedCustomerString });
            this._appContext.toaster.error(errorMessage);
        }
    }
    public removeCustomer(customer: CustomerDO) {
        if (this.isBilledCustomer(customer)) { return; }
        this.customerContainer.removeCustomer(customer);
        this._didMakeChanges = true;
    }

    public endEdit() {
        this.readonly = true;
        this._bookingOperationsPageData.customersContainer = this._customersContainerCopy;
    }

    public saveCustomers() {
        if (!this.hasCustomerEditRight || !this._didMakeChanges) {
            this.endEdit();
            return;
        }
        this.isSaving = true;

        this._bookingOperationsPageData.bookingDO.customerIdList = _.map(this.customerList, (customer: CustomerDO) => { return customer.id });
        this._hotelOperationsBookingService.changeCustomers(this._bookingOperationsPageData.bookingDO).flatMap((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("booking", "edit-customers", "Changed the customers for a booking");
            this.readonly = true;
            this.isSaving = false;
            
            let bookingChangeGuestOnInvoiceDO = {
                groupBookingId: this._bookingOperationsPageData.bookingDO.groupBookingId,
                bookingId: this._bookingOperationsPageData.bookingDO.bookingId,
                customerIdDisplayedOnInvoice: this.bookingDO.defaultBillingDetails.customerIdDisplayedAsGuest
            };

            return this._hotelOperationsBookingService.changeGuestOnInvoice(bookingChangeGuestOnInvoiceDO);
        }).subscribe((updatedBooking: BookingDO) => {
            this._appContext.analytics.logEvent("booking", "edit-customers", "Changed the guest displayed on invoice for a booking");
            this.readonly = true;
            this.isSaving = false;
            this.triggerOnCustomersChanged(updatedBooking);
        }, (error: ThError) => {
            this.isSaving = false;
            this._appContext.toaster.error(error.message);
        });
    }
}