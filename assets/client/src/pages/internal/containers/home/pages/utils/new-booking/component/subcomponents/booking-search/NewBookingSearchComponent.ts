import {Component, AfterViewInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {SearchInputTextComponent} from '../../../../../../../../../../common/utils/components/SearchInputTextComponent';
import {DebouncingInputTextComponent} from '../../../../../../../../../../common/utils/components/DebouncingInputTextComponent';
import {ThDateIntervalPickerComponent} from '../../../../../../../../../../common/utils/components/ThDateIntervalPickerComponent';
import {ThDateIntervalDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import {ThDateDO} from '../../../../../../../../services/common/data-objects/th-dates/ThDateDO';
import {ThDateUtils} from '../../../../../../../../services/common/data-objects/th-dates/ThDateUtils';
import {CustomerSearchService} from '../../../../../../../../services/customers/CustomerSearchService';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {CustomersDO} from '../../../../../../../../services/customers/data-objects/CustomersDO';
import {EagerCustomersService} from '../../../../../../../../services/customers/EagerCustomersService';
import {BookingControllerService} from '../utils/BookingControllerService';
import {IBookingCustomerRegisterSelector} from '../utils/IBookingCustomerRegister';

@Component({
	selector: 'new-booking-search',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/template/new-booking-search.html',
	directives: [CustomScroll, ThDateIntervalPickerComponent, SearchInputTextComponent, DebouncingInputTextComponent],
	providers: [CustomerSearchService, EagerCustomersService],
	pipes: [TranslationPipe]
})
export class NewBookingSearchComponent extends BaseComponent implements AfterViewInit {
	private _dateUtils: ThDateUtils = new ThDateUtils();

	minDate: ThDateDO;
	@ViewChild(SearchInputTextComponent)
	private _customerSearchTextInputComponent: SearchInputTextComponent<CustomerDO>;

	bookingCode: string = "";
	loadingCustomerByCode: boolean = false;
	showBookingCodeMessage: boolean = false;
	validBookingCode: boolean = false;

	private _customerRegisterSelector: IBookingCustomerRegisterSelector;
	private _customer: CustomerDO;
	bookingInterval: ThDateIntervalDO;

	constructor(private _customerSearchService: CustomerSearchService,
		private _bookingControllerService: BookingControllerService,
		private _eagerCustomersService: EagerCustomersService) {
		super();
		this._customerRegisterSelector = _bookingControllerService;

		this.minDate = this._dateUtils.addDaysToThDateDO(this._dateUtils.getTodayThDayeDO(), -1);
		this.bookingInterval = this._dateUtils.getTodayToTomorrowInterval();
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
		this.bookingInterval = bookingInterval;
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
	}

	public get customer(): CustomerDO {
		return this._customer;
	}
	public set customer(customer: CustomerDO) {
		this._customer = customer;
		this.bookingCode = customer.priceProductDetails.bookingCode;
		this.showBookingCodeMessage = true;
		this.validBookingCode = true;
	}
}