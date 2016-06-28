import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {AppContext, ThError} from '../../../../../../../../../../common/utils/AppContext';
import {CustomScroll} from '../../../../../../../../../../common/utils/directives/CustomScroll';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {BookingSearchParametersComponent} from './components/search-parameters/BookingSearchParametersComponent';
import {BookingSearchParams} from '../../../services/data-objects/BookingSearchParams';
import {EagerBookingSearch} from '../../../services/search/EagerBookingSearch';
import {BookingSearchResultDO} from '../../../services/search/data-objects/BookingSearchResultDO';

@Component({
	selector: 'new-booking-search',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-search/template/new-booking-search.html',
	directives: [CustomScroll,
		BookingSearchParametersComponent],
	providers: [EagerBookingSearch],
	pipes: [TranslationPipe]
})
export class NewBookingSearchComponent extends BaseComponent {
	constructor(private _appContext: AppContext, private _eagerBookingSearch: EagerBookingSearch) {
		super();
	}

	public searchBookings(bookingSearchParams: BookingSearchParams) {
		bookingSearchParams.transientBookingList = [];

		// TODO
		console.log(bookingSearchParams);
		this._eagerBookingSearch.searchBookings(bookingSearchParams).subscribe((searchResult: BookingSearchResultDO) => {

			// TODO
			console.log(searchResult);
		}, (err: ThError) => {
			this._appContext.toaster.error(err.message);
		});
	}
}