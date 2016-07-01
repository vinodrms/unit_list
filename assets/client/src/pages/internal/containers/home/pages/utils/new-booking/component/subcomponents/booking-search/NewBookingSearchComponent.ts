import {Component, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {TableColumnValueMeta} from '../../../../../../../../../../common/utils/components/lazy-loading/utils/LazyLoadTableMeta';
import {AppContext, ThError} from '../../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {RoomCategoryDO} from '../../../../../../../../services/room-categories/data-objects/RoomCategoryDO';
import {BookingSearchParametersComponent} from './components/search-parameters/BookingSearchParametersComponent';
import {BookingSearchParams} from '../../../services/data-objects/BookingSearchParams';
import {BookingSearchService} from '../../../services/search/BookingSearchService';
import {BookingItemVM} from '../../../services/search/view-models/BookingItemVM';
import {BookingSearchTableMetaBuilderService} from './services/BookingSearchTableMetaBuilderService';
import {BookingSearchStepService} from './services/BookingSearchStepService';
import {BookingCartService} from '../../../services/search/BookingCartService';

@Component({
	selector: 'new-booking-search',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/template/new-booking-search.html',
	directives: [CustomScroll, LazyLoadingTableComponent,
		BookingSearchParametersComponent],
	providers: [BookingSearchService, BookingSearchTableMetaBuilderService],
	pipes: [TranslationPipe]
})
export class NewBookingSearchComponent extends BaseComponent {
	@ViewChild('searchResults') private _searchResultsTableComponent: LazyLoadingTableComponent<BookingItemVM>;
	@ViewChild('bookingCart') private _bookingCartTableComponent: LazyLoadingTableComponent<BookingItemVM>;

	private _roomCategoryList: RoomCategoryDO[];
	isSearching: boolean = false;
	private _bookingSearchParams: BookingSearchParams;

	constructor(private _appContext: AppContext, private _wizardBookingSearchService: BookingSearchStepService,
		private _bookingSearchService: BookingSearchService, private _tableMetaBuilder: BookingSearchTableMetaBuilderService,
		private _bookingCartService: BookingCartService) {
		super();
	}
	public ngAfterViewInit() {
		this._searchResultsTableComponent.bootstrap(this._bookingSearchService, this._tableMetaBuilder.buildSearchResultsTableMeta());
		this._searchResultsTableComponent.attachCustomCellClassGenerator(this._tableMetaBuilder.customCellClassGenerator);
		this._bookingCartTableComponent.bootstrap(this._bookingCartService, this._tableMetaBuilder.buildBookingCartTableMeta());
	}

	public searchBookings(bookingSearchParams: BookingSearchParams) {
		this._bookingSearchParams = bookingSearchParams;
		this._bookingSearchParams.transientBookingList = this._bookingCartService.getTransientBookingItemList();
		this.isSearching = true;
		this._bookingSearchService.searchBookings(this._bookingSearchParams)
			.subscribe((searchResult: { roomCategoryList: RoomCategoryDO[], bookingItemList: BookingItemVM[] }) => {
                this._roomCategoryList = searchResult.roomCategoryList;
				this.isSearching = false;
            }, (error: ThError) => {
				this.isSearching = false;
                this._appContext.toaster.error(error.message);
            });
	}
	public addBookingVMInCart(bookingItemVM: BookingItemVM) {
		var addResult = this._bookingCartService.addBookingItem(bookingItemVM);
		if (!addResult.success) {
			this._appContext.toaster.error(addResult.errorMessage);
			return;
		}
		this._wizardBookingSearchService.checkBookingCartValidity(this._bookingCartService, this._roomCategoryList);
		this._bookingSearchService.decrementInventoryAvailability(bookingItemVM.transientBookingItem);
	}
	public removeBookingVMFromCart(bookingItemVM: BookingItemVM) {
		var title = this._appContext.thTranslation.translate("Delete Price Product");
		var content = this._appContext.thTranslation.translate("Are you sure you want to remove %priceProductName% from the cart?", { priceProductName: bookingItemVM.priceProductName });
		this._appContext.modalService.confirm(title, content, { positive: this._appContext.thTranslation.translate("Yes"), negative: this._appContext.thTranslation.translate("No") },
			() => {
				this.removeBookingVMFromCartCore(bookingItemVM);
			}, () => { });
	}
	private removeBookingVMFromCartCore(bookingItemVM: BookingItemVM) {
		if (!this._bookingSearchParams) { return; }
		this._bookingCartService.removeBookingItem(bookingItemVM);
		this.searchBookings(this._bookingSearchParams);
		this._wizardBookingSearchService.checkBookingCartValidity(this._bookingCartService, this._roomCategoryList);
	}
}