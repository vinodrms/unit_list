import {Component, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {AppContext, ThError} from '../../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {BookingSearchParametersComponent} from './components/search-parameters/BookingSearchParametersComponent';
import {BookingSearchParams} from '../../../services/data-objects/BookingSearchParams';
import {BookingSearchService} from '../../../services/search/BookingSearchService';
import {BookingResultVM} from '../../../services/search/view-models/BookingResultVM';
import {BookingSearchTableMetaBuilderService} from './services/BookingSearchTableMetaBuilderService';

@Component({
	selector: 'new-booking-search',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/template/new-booking-search.html',
	directives: [CustomScroll, LazyLoadingTableComponent,
		BookingSearchParametersComponent],
	providers: [BookingSearchService, BookingSearchTableMetaBuilderService],
	pipes: [TranslationPipe]
})
export class NewBookingSearchComponent extends BaseComponent {
	@ViewChild(LazyLoadingTableComponent)
	private _aopTableComponent: LazyLoadingTableComponent<BookingResultVM>;

	constructor(private _appContext: AppContext, private _bookingSearchService: BookingSearchService, private _tableMetaBuilder: BookingSearchTableMetaBuilderService) {
		super();
	}
	public ngAfterViewInit() {
		this._aopTableComponent.bootstrap(this._bookingSearchService, this._tableMetaBuilder.buildLazyLoadTableMeta());
	}

	public searchBookings(bookingSearchParams: BookingSearchParams) {
		bookingSearchParams.transientBookingList = [];
		this._bookingSearchService.searchBookings(bookingSearchParams);
	}
}