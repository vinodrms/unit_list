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
import {InMemoryBookingService} from '../../../services/search/InMemoryBookingService';

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

	constructor(private _appContext: AppContext, private _wizardBookingSearchService: BookingSearchStepService,
		private _bookingSearchService: BookingSearchService, private _tableMetaBuilder: BookingSearchTableMetaBuilderService,
		private _inMemoryBookingService: InMemoryBookingService) {
		super();
	}
	public ngAfterViewInit() {
		this._searchResultsTableComponent.bootstrap(this._bookingSearchService, this._tableMetaBuilder.buildSearchResultsTableMeta());
		this._searchResultsTableComponent.attachCustomCellClassGenerator(this._tableMetaBuilder.customCellClassGenerator);
		this._bookingCartTableComponent.bootstrap(this._inMemoryBookingService, this._tableMetaBuilder.buildBookingCartTableMeta());
	}

	public searchBookings(bookingSearchParams: BookingSearchParams) {
		bookingSearchParams.transientBookingList = this._inMemoryBookingService.getTransientBookingItemList();
		this.isSearching = true;
		this._bookingSearchService.searchBookings(bookingSearchParams)
			.subscribe((searchResult: { roomCategoryList: RoomCategoryDO[], bookingItemList: BookingItemVM[] }) => {
                this._roomCategoryList = searchResult.roomCategoryList;
				this.isSearching = false;
            }, (error: ThError) => {
				this.isSearching = false;
                this._appContext.toaster.error(error.message);
            });
	}
	public addBookingVMInCart(bookingItemVM: BookingItemVM) {
		this._inMemoryBookingService.addBookingItem(bookingItemVM);
		this._wizardBookingSearchService.checkBookingCartValidity(this._inMemoryBookingService, this._roomCategoryList);
		// TODO: decrement
	}
}