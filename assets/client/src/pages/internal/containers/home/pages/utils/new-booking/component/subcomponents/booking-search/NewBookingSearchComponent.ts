import { Component, ViewChild, AfterViewInit, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../../../../../../../common/base/BaseComponent';
import { LazyLoadingTableComponent } from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { TableColumnValueMeta } from '../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import { AppContext, ThError } from '../../../../../../../../../../common/utils/AppContext';
import { RoomCategoryDO } from '../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import { BookingSearchParams } from '../../../services/data-objects/BookingSearchParams';
import { BookingSearchService } from '../../../services/search/BookingSearchService';
import { BookingCartItemVM, BookingCartItemVMType } from '../../../services/search/view-models/BookingCartItemVM';
import { BookingSearchResultsTableMetaBuilderService } from '../utils/table-builder/BookingSearchResultsTableMetaBuilderService';
import { BookingCartTableMetaBuilderService } from '../utils/table-builder/BookingCartTableMetaBuilderService';
import { BookingTableUtilsService } from '../utils/table-builder/BookingTableUtilsService';
import { BookingSearchStepService } from './services/BookingSearchStepService';
import { BookingCartService } from '../../../services/search/BookingCartService';
import { RoomCategoryItemDO } from '../../../services/search/data-objects/room-category-item/RoomCategoryItemDO';
import { RoomAvailabilityModalService } from './modal/service/RoomAvailabilityModalService';
import { EagerBookingsService } from "../../../../../../../../services/bookings/EagerBookingsService";
import { ConfigCapacityDO } from "../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO";
import { Observable } from "rxjs/Observable";
import { BookingsDO } from "../../../../../../../../services/bookings/data-objects/BookingsDO";
import { BookingVM } from "../../../../../../../../services/bookings/view-models/BookingVM";
import { EagerCustomersService } from "../../../../../../../../services/customers/EagerCustomersService";
import { HotelAggregatorService } from "../../../../../../../../services/hotel/HotelAggregatorService";
import { RoomCategoriesService } from "../../../../../../../../services/room-categories/RoomCategoriesService";
import { NewBookingModalInput } from "../../../modal/services/utils/NewBookingModalInput";
import { HotelAggregatedInfo } from "../../../../../../../../services/hotel/utils/HotelAggregatedInfo";
import { BookingViewModelConverter } from "../../../services/search/utils/BookingViewModelConverter";
import { KeyValueModalService } from "../../../../../../../../../../common/utils/modals/modals/keyvalue/KeyValueModalService";
import { PricePerDayDO } from "../../../../../../../../services/bookings/data-objects/price/PricePerDayDO";

import * as _ from "underscore";

@Component({
	selector: 'new-booking-search',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/template/new-booking-search.html',
	providers: [EagerBookingsService, EagerCustomersService, RoomCategoriesService, BookingSearchService, BookingSearchResultsTableMetaBuilderService,
		BookingCartTableMetaBuilderService, BookingTableUtilsService, RoomAvailabilityModalService, KeyValueModalService]
})
export class NewBookingSearchComponent extends BaseComponent implements AfterViewInit, OnInit {
	@ViewChild('searchResults') private _searchResultsTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;
	@ViewChild('bookingCart') private _bookingCartTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;

	@Input() newBookingInput: NewBookingModalInput;

	private _roomCategoryList: RoomCategoryDO[];
	isSearching: boolean = false;
	private _bookingSearchParams: BookingSearchParams;
	private _roomCategoryItemList: RoomCategoryItemDO[];

	constructor(private _appContext: AppContext,
		private _wizardBookingSearchService: BookingSearchStepService,
		private _eagerBookingsService: EagerBookingsService,
		private _hotelAggregatedService: HotelAggregatorService,
		private _bookingSearchService: BookingSearchService,
		private _searchTableMetaBuilder: BookingSearchResultsTableMetaBuilderService,
		private _cartTableMetaBuilder: BookingCartTableMetaBuilderService,
		private _bookingTableUtilsService: BookingTableUtilsService, private _bookingCartService: BookingCartService,
		private _roomAvailabilityModalService: RoomAvailabilityModalService,
		private _keyValueModalService: KeyValueModalService) {
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

		if (!this._appContext.thUtils.isUndefinedOrNull(this.newBookingInput)) {
			this._bookingCartService.groupBookingId = this.newBookingInput.groupBookingId;

			Observable.combineLatest(
				this._hotelAggregatedService.getHotelAggregatedInfo(),
				this._eagerBookingsService.getBookingVMListByGroupBookingId(this.newBookingInput.groupBookingId)
			).subscribe((result: [HotelAggregatedInfo, BookingVM[]]) => {
				let hotelAggregatedInfo = result[0];
				let bookingVMList = result[1];

				let converter = new BookingViewModelConverter(this._appContext.thTranslation);
				let bookingCartItemVMList = converter.createBookingCartItemVMListFromBookingVMList(hotelAggregatedInfo, bookingVMList);
				_.forEach(bookingCartItemVMList, (bookingCartItem: BookingCartItemVM) => {
					this.addBookingVMInCart(bookingCartItem);
				});
			});
		}

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
	public showDetailsForBookingVM(bookingCartItemVM: BookingCartItemVM) {
		var title = this._appContext.thTranslation.translate("Price Breakdown");
		var content = {};
		_.forEach(bookingCartItemVM.pricePerDayList, (pricePerDay: PricePerDayDO) => {
			content[pricePerDay.thDate.getLongDisplayString(this._appContext.thTranslation)] = pricePerDay.price + bookingCartItemVM.ccy.nativeSymbol;
		});
		content[this._appContext.thTranslation.translate("Commision")] = "-" + bookingCartItemVM.commisionString;
		content[this._appContext.thTranslation.translate("Other")] = "+" + bookingCartItemVM.otherPriceString;
		content[this._appContext.thTranslation.translate("Total Price")] = bookingCartItemVM.totalPriceString;
		this._keyValueModalService.openModal(title, content);
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