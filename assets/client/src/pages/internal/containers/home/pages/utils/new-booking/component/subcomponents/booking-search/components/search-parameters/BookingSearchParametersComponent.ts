import {Component, ViewChild, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../../common/base/BaseComponent';
import {SearchInputTextComponent} from '../../../../../../../../../../../../common/utils/components/SearchInputTextComponent';
import {ThDateIntervalPickerComponent} from '../../../../../../../../../../../../common/utils/components/ThDateIntervalPickerComponent';
import {ThDateIntervalDO} from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateDO} from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThDateUtils} from '../../../../../../../../../../services/common/data-objects/th-dates/ThDateUtils';
import {CustomerSearchService} from '../../../../../../../../../../services/customers/CustomerSearchService';
import {CustomerDO} from '../../../../../../../../../../services/customers/data-objects/CustomerDO';
import {CustomersDO} from '../../../../../../../../../../services/customers/data-objects/CustomersDO';
import {EagerCustomersService} from '../../../../../../../../../../services/customers/EagerCustomersService';
import {BookingControllerService} from '../../../utils/BookingControllerService';
import {IBookingCustomerRegisterSelector} from '../../../utils/IBookingCustomerRegister';
import {BookingSearchParams} from '../../../../../services/data-objects/BookingSearchParams';

@Component({
    selector: 'booking-search-parameters',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/components/search-parameters/template/booking-search-parameters.html',
    providers: [CustomerSearchService, EagerCustomersService]
})
export class BookingSearchParametersComponent extends BaseComponent implements AfterViewInit {
    @Input() isSearching: boolean;
    @Output() protected onBookingSearch = new EventEmitter<BookingSearchParams>();
    private _didSearchForBookings: boolean = false;

    @ViewChild(SearchInputTextComponent)
    private _customerSearchTextInputComponent: SearchInputTextComponent<CustomerDO>;

    private _dateUtils: ThDateUtils = new ThDateUtils();

    bookingCode: string = "";
    loadingCustomerByCode: boolean = false;
    showBookingCodeMessage: boolean = false;
    validBookingCode: boolean = false;

    private _customerRegisterSelector: IBookingCustomerRegisterSelector;
    private _customer: CustomerDO;

    minDate: ThDateDO;
    searchParameters: BookingSearchParams;

    constructor(private _customerSearchService: CustomerSearchService,
        private _bookingControllerService: BookingControllerService, private _eagerCustomersService: EagerCustomersService) {

        super();
        this._customerRegisterSelector = _bookingControllerService;
        this.generateDefaultBookingSearchParams();
    }
    private generateDefaultBookingSearchParams() {
        this.minDate = this._dateUtils.addDaysToThDateDO(this._dateUtils.getTodayThDayeDO(), -1);

        this.searchParameters = new BookingSearchParams();
        this.searchParameters.interval = this._dateUtils.getTodayToTomorrowInterval();
        this.searchParameters.configCapacity.noAdults = 2;
        this.searchParameters.configCapacity.noChildren = 0;
        this.searchParameters.configCapacity.noBabies = 0;
    }

    ngAfterViewInit() {
        this._customerSearchTextInputComponent.bootstrap(this._customerSearchService, {
            objectPropertyId: "id",
            displayStringPropertyId: "customerNameAndEmailString"
        });
    }

    private searchCustomerByBookingCode(bookingCode: string) {
        if (bookingCode.length == 0) {
            this.showBookingCodeMessage = false;
            return;
        }
        this.loadingCustomerByCode = true;
        this._eagerCustomersService.getCustomersByBookingCode(bookingCode).subscribe((customers: CustomersDO) => {
            this.loadingCustomerByCode = false;
            this.showBookingCodeMessage = true;
            if (customers.customerList.length == 0) {
                this.validBookingCode = false;
                return;
            }
            this.customer = customers.customerList[0];
        });
    }
    public didSelectBookingInterval(bookingInterval: ThDateIntervalDO) {
        this.searchParameters.interval = bookingInterval;
        this.updateSearchResultsIfNecessary();
    }
    public selectCustomer() {
        this._customerRegisterSelector.selectCustomerFromRegister().subscribe((selectedCustomer: CustomerDO) => {
            this.customer = selectedCustomer;
        });
    }

    public didSelectCustomer(customer: CustomerDO) {
        this.customer = customer;
    }
    public didDeselectCustomer() {
        this._customer = null;
        this.showBookingCodeMessage = false;
        this.bookingCode = "";
        delete this.searchParameters.customerId;
        this.updateSearchResultsIfNecessary();
    }

    public searchBookings() {
        if (!this.searchParameters.areValid() || this.isSearching) {
            return;
        }
        this._didSearchForBookings = true;
        this.onBookingSearch.next(this.searchParameters);
    }
    private updateSearchResultsIfNecessary() {
        if (!this._didSearchForBookings) { return; }
        this.searchBookings();
    }

    public get customer(): CustomerDO {
        return this._customer;
    }
    public set customer(customer: CustomerDO) {
        this._customer = customer;
        this.bookingCode = customer.priceProductDetails.bookingCode;
        this.showBookingCodeMessage = true;
        this.validBookingCode = true;
        this.searchParameters.customerId = customer.id;
        this.updateSearchResultsIfNecessary();
    }
}