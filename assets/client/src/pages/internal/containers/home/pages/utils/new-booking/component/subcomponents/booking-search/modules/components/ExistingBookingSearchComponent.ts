import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BookingCartItemVM, BookingCartItemVMType } from '../../../../../services/search/view-models/BookingCartItemVM';
import { ExistingBookingSearchInput } from './utils/ExistingBookingSearchInput';
import { BookingSearchParams } from '../../../../../services/data-objects/BookingSearchParams';
import { CustomersDO } from '../../../../../../../../../../services/customers/data-objects/CustomersDO';
import { CustomerDO } from '../../../../../../../../../../services/customers/data-objects/CustomerDO';

@Component({
    selector: 'existing-booking-search',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/modules/components/template/existing-booking-search.html'
})
export class ExistingBookingSearchComponent implements OnInit {
    @Input() searchInput: ExistingBookingSearchInput;

    @Output() onBookingCartItemVMSelected = new EventEmitter<BookingCartItemVM>();
    public triggerOnBookingCartItemVMSelected(bookingCartItem: BookingCartItemVM) {
        this.onBookingCartItemVMSelected.next(bookingCartItem);
    }

    bookingSearchParams: BookingSearchParams;
    private _selectedCustomer: CustomerDO;

    constructor() { }

    ngOnInit() {
        this.bookingSearchParams = new BookingSearchParams();
        this.bookingSearchParams.interval = this.searchInput.booking.interval;
        this.bookingSearchParams.transientBookingList = [];
        this.bookingSearchParams.configCapacity = this.searchInput.booking.configCapacity;
        this.selectedCustomer = this.searchInput.customersContainer.getCustomerById(this.searchInput.booking.defaultBillingDetails.customerId);
    }

    public get customerList(): CustomerDO[] {
        return this.searchInput.customersContainer.customerList;
    }

    public get selectedCustomer(): CustomerDO {
        return this._selectedCustomer;
    }
    public set selectedCustomer(selectedCustomer: CustomerDO) {
        this._selectedCustomer = selectedCustomer;
        this.bookingSearchParams.customerId = selectedCustomer.id;
    }

    public selectBookingCartItem() {

    }
}