import {Component, ViewChild, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {CustomerDO} from '../../../../../../../../services/customers/data-objects/CustomerDO';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {BookingCartService} from '../../../services/search/BookingCartService';
import {BookingCartItemVM, BookingCartItemVMType} from '../../../services/search/view-models/BookingCartItemVM';
import {BookingCartTableMetaBuilderService} from '../utils/table-builder/BookingCartTableMetaBuilderService';
import {BookingTableUtilsService} from '../utils/table-builder/BookingTableUtilsService';
import {BookingFillDetailsStepService} from './services/BookingFillDetailsStepService';
import {LazyLoadTableMeta} from '../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';

@Component({
	selector: 'new-booking-fill-details',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-fill-details/template/new-booking-fill-details.html',
	providers: [BookingCartTableMetaBuilderService, BookingTableUtilsService]
})
export class NewBookingFillDetailsComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy {
	@ViewChild('bookingCartSelectable') private _bookingCartTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;

	private _didAppearSubscription: Subscription;

	private _selectedCartSequenceId: number = -1;
	private _selectedBookingCartItemVM: BookingCartItemVM;

	constructor(private _appContext: AppContext, private _bookingCartService: BookingCartService,
		private _wizardBookingFillDetailsStepService: BookingFillDetailsStepService, private _cartTableMetaBuilder: BookingCartTableMetaBuilderService,
		private _bookingTableUtilsService: BookingTableUtilsService) {
		super();
	}

	public ngAfterViewInit() {
		var cartTableMeta: LazyLoadTableMeta = this._cartTableMetaBuilder.buildBookingCartTableMeta();
		cartTableMeta.autoSelectRows = true;
		this._bookingCartTableComponent.bootstrap(this._bookingCartService, cartTableMeta);
		this._bookingCartTableComponent.attachCustomCellClassGenerator(this._bookingTableUtilsService.customCellClassGeneratorForBookingCart);
		this._bookingCartTableComponent.attachCustomRowClassGenerator(this._bookingTableUtilsService.customRowClassGeneratorForBookingCart);
		this._bookingCartTableComponent.attachCustomRowCommandPerformPolicy(this._bookingTableUtilsService.canPerformCommandOnItemForBookingCart);
	}
	public ngOnInit() {
		this._didAppearSubscription = this._wizardBookingFillDetailsStepService.didAppearObservable.subscribe((didAppear: boolean) => {
			this.viewDidAppear();
        });
		this._appContext.analytics.logPageView("/operations/new-booking/fill-details");
	}
	public ngOnDestroy() {
		if (this._didAppearSubscription) { this._didAppearSubscription.unsubscribe(); }
	}

	private viewDidAppear() {
		var foundBookingCartItem: BookingCartItemVM = this._bookingCartService.getBookingCartItemByCartSequenceId(this._selectedCartSequenceId);
		if (this._appContext.thUtils.isUndefinedOrNull(foundBookingCartItem)) {
			foundBookingCartItem = this._bookingCartService.bookingItemVMList[0];
		}
		this.selectBookingCartItem(foundBookingCartItem);
	}

	public selectBookingCartItem(bookingCartItemVM: BookingCartItemVM) {
		if (bookingCartItemVM.itemType === BookingCartItemVMType.Total) { return; }
		this.selectedBookingCartItemVM = bookingCartItemVM;
	}

	public get selectedBookingCartItemVM(): BookingCartItemVM {
		return this._selectedBookingCartItemVM;
	}
	public set selectedBookingCartItemVM(selectedBookingCartItemVM: BookingCartItemVM) {
		this._selectedBookingCartItemVM = selectedBookingCartItemVM;
		this._selectedCartSequenceId = selectedBookingCartItemVM.cartSequenceId;
		this._bookingCartTableComponent.selectItem(selectedBookingCartItemVM);
		this._wizardBookingFillDetailsStepService.checkBookingCartValidity(this._bookingCartService);
	}

	public didUpdateBookingItem(changedBookingCartItemVM: BookingCartItemVM) {
		_.forEach(this._bookingCartService.bookingItemVMList, (bookingCartItem: BookingCartItemVM) => {
			if (bookingCartItem.cartSequenceId === changedBookingCartItemVM.cartSequenceId) {
				bookingCartItem = changedBookingCartItemVM;
				bookingCartItem.updateValidationColumn();
			}
			else if (changedBookingCartItemVM.customerList.length > 0) {
				var lastCustomerIndex = changedBookingCartItemVM.customerList.length - 1;
				this.updateDefaultBilledCustomerIfNecessary(bookingCartItem, changedBookingCartItemVM.customerList[lastCustomerIndex]);
			}
		});
		this._bookingCartService.refreshData();
		this._wizardBookingFillDetailsStepService.checkBookingCartValidity(this._bookingCartService);
	}
	private updateDefaultBilledCustomerIfNecessary(bookingCartItem: BookingCartItemVM, customerToAdd: CustomerDO) {
		bookingCartItem.updateCustomerIfExists(customerToAdd);
		if (!customerToAdd.hasAccessOnPriceProduct(bookingCartItem.priceProduct)) {
			if (bookingCartItem.transientBookingItem.defaultBillingDetails.customerId === customerToAdd.id) {
				bookingCartItem.removeBilledToCustomer();
				bookingCartItem.updateValidationColumn();
			}
			return;
		}
		if (bookingCartItem.didSelectBilledToCustomer() || bookingCartItem.customerList.length > 0) {
			return;
		}
		bookingCartItem.addCustomerIfNotExists(customerToAdd);
		bookingCartItem.transientBookingItem.defaultBillingDetails.customerId = customerToAdd.id;
		bookingCartItem.customerNameString = customerToAdd.customerName;
		bookingCartItem.updateValidationColumn();
	}
}