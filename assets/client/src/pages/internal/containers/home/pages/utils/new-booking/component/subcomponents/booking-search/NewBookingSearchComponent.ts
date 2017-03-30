import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {TableColumnValueMeta} from '../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import {AppContext, ThError} from '../../../../../../../../../../common/utils/AppContext';
import {RoomCategoryDO} from '../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {BookingSearchParams} from '../../../services/data-objects/BookingSearchParams';
import {BookingSearchService} from '../../../services/search/BookingSearchService';
import {BookingCartItemVM, BookingCartItemVMType} from '../../../services/search/view-models/BookingCartItemVM';
import {BookingSearchResultsTableMetaBuilderService} from '../utils/table-builder/BookingSearchResultsTableMetaBuilderService';
import {BookingCartTableMetaBuilderService} from '../utils/table-builder/BookingCartTableMetaBuilderService';
import {BookingTableUtilsService} from '../utils/table-builder/BookingTableUtilsService';
import {BookingSearchStepService} from './services/BookingSearchStepService';
import {BookingCartService} from '../../../services/search/BookingCartService';
import {RoomCategoryItemDO} from '../../../services/search/data-objects/room-category-item/RoomCategoryItemDO';
import {RoomAvailabilityModalService} from './modal/service/RoomAvailabilityModalService';

@Component({
	selector: 'new-booking-search',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/template/new-booking-search.html',
	providers: [BookingSearchService, BookingSearchResultsTableMetaBuilderService,
		BookingCartTableMetaBuilderService, BookingTableUtilsService, RoomAvailabilityModalService]
})
export class NewBookingSearchComponent extends BaseComponent implements AfterViewInit, OnInit {
	@ViewChild('searchResults') private _searchResultsTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;
	@ViewChild('bookingCart') private _bookingCartTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;

	private _roomCategoryList: RoomCategoryDO[];
	isSearching: boolean = false;
	private _bookingSearchParams: BookingSearchParams;
	private _roomCategoryItemList: RoomCategoryItemDO[];

	constructor(private _appContext: AppContext, private _wizardBookingSearchService: BookingSearchStepService,
		private _bookingSearchService: BookingSearchService, private _searchTableMetaBuilder: BookingSearchResultsTableMetaBuilderService,
		private _cartTableMetaBuilder: BookingCartTableMetaBuilderService, private _bookingTableUtilsService: BookingTableUtilsService,
		private _bookingCartService: BookingCartService,
		private _roomAvailabilityModalService: RoomAvailabilityModalService) {
		super();
	}
	public ngOnInit() {
		this._appContext.analytics.logPageView("/operations/new-booking/search");
	}
	public ngAfterViewInit() {
		this._searchResultsTableComponent.bootstrap(this._bookingSearchService, this._searchTableMetaBuilder.buildSearchResultsTableMeta());
		this._searchResultsTableComponent.attachCustomCellClassGenerator(this._searchTableMetaBuilder.customCellClassGenerator);

		this._bookingCartTableComponent.bootstrap(this._bookingCartService, this._cartTableMetaBuilder.buildBookingCartPreviewTableMeta());
		this._bookingCartTableComponent.attachCustomCellClassGenerator(this._bookingTableUtilsService.customCellClassGeneratorForBookingCart);
		this._bookingCartTableComponent.attachCustomRowClassGenerator(this._bookingTableUtilsService.customRowClassGeneratorForBookingCart);
		this._bookingCartTableComponent.attachCustomRowCommandPerformPolicy(this._bookingTableUtilsService.canPerformCommandOnItemForBookingCart);
	}

	public searchBookings(bookingSearchParams: BookingSearchParams) {
		this._bookingSearchParams = bookingSearchParams;
		this._bookingSearchParams.transientBookingList = this._bookingCartService.getTransientBookingItemList();
		this.isSearching = true;
		this._bookingSearchService.searchBookings(this._bookingSearchParams)
			.subscribe((searchResult: { roomCategoryList: RoomCategoryDO[], bookingItemList: BookingCartItemVM[], roomCategoryItemList: RoomCategoryItemDO[] }) => {
				this._roomCategoryList = searchResult.roomCategoryList;
				this._roomCategoryItemList = searchResult.roomCategoryItemList;
				this.isSearching = false;
			}, (error: ThError) => {
				this.isSearching = false;
				this._appContext.toaster.error(error.message);
			});
	}
	public addBookingVMInCart(bookingCartItemVM: BookingCartItemVM) {
		if (bookingCartItemVM.itemType === BookingCartItemVMType.Total) { return; }
		var addResult = this._bookingCartService.addBookingItem(bookingCartItemVM);
		if (!addResult.success) {
			this._appContext.toaster.error(addResult.errorMessage);
			return;
		}
		this._bookingTableUtilsService.updateBookingCartTotalsRow(this._bookingCartService);
		this._bookingCartService.refreshData();

		this._wizardBookingSearchService.checkBookingCartValidity(this._bookingCartService, this._roomCategoryList);
		this._bookingSearchService.decrementInventoryAvailability(bookingCartItemVM.transientBookingItem);
	}
	public removeBookingVMFromCart(bookingCartItemVM: BookingCartItemVM) {
		var title = this._appContext.thTranslation.translate("Delete Price Product");
		var content = this._appContext.thTranslation.translate("Are you sure you want to remove %priceProductName% from the cart?", { priceProductName: bookingCartItemVM.priceProductName });
		this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
			() => {
				this.removeBookingVMFromCartCore(bookingCartItemVM);
			}, () => { });
	}
	public getTotalNumberOfRooms() {
		if (!this._roomCategoryItemList || this._roomCategoryItemList.length == 0) { return; }
		var total = 0;
		this._roomCategoryItemList.forEach(roomCategoryItem => {
			total += roomCategoryItem.stats.noOfRooms;
		});
		return total;
	}
	public getNumberOfAvailableRooms() {
		if (!this._roomCategoryItemList || this._roomCategoryItemList.length == 0) { return; }
		var available = 0;
		this._roomCategoryItemList.forEach(roomCategoryItem => {
			available += roomCategoryItem.availableRooms;
		});
		return available;
	}
	public openRoomAvailabilityModal() {
		this._roomAvailabilityModalService.openNewRoomAvailabilityModal(this._roomCategoryItemList);
	}
	private removeBookingVMFromCartCore(bookingCartItemVM: BookingCartItemVM) {
		if (!this._bookingSearchParams) { return; }
		this._bookingCartService.removeBookingItem(bookingCartItemVM);
		this._bookingTableUtilsService.updateBookingCartTotalsRow(this._bookingCartService);
		this._bookingCartService.refreshData();

		this.searchBookings(this._bookingSearchParams);
		this._wizardBookingSearchService.checkBookingCartValidity(this._bookingCartService, this._roomCategoryList);
	}
}