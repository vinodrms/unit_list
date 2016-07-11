import {Component, AfterViewInit, ViewChild} from '@angular/core';
import {LazyLoadingTableComponent} from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {HeaderPageService} from '../../utils/header/container/services/HeaderPageService';
import {HeaderPageType} from '../../utils/header/container/services/HeaderPageType';
import {AHomeContainerComponent} from '../../utils/AHomeContainerComponent';
import {BookingsService} from '../../../../../services/bookings/BookingsService';
import {BookingVM} from '../../../../../services/bookings/view-models/BookingVM';
import {EagerCustomersService} from '../../../../../services/customers/EagerCustomersService';
import {BookingsTableMetaBuilderService} from './services/BookingsTableMetaBuilderService';

@Component({
	selector: 'booking-history-dashboard',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/booking-history/template/booking-history-dashboard.html',
	providers: [EagerCustomersService, BookingsService, BookingsTableMetaBuilderService],
	directives: [LazyLoadingTableComponent]
})

export class BookingHistoryDashboardComponent extends AHomeContainerComponent implements AfterViewInit {
	@ViewChild(LazyLoadingTableComponent)
	private _bookingsTableComponent: LazyLoadingTableComponent<BookingVM>;

	constructor(headerPageService: HeaderPageService,
		private _bookingsService: BookingsService,
		private _tableBuilder: BookingsTableMetaBuilderService) {
		super(headerPageService, HeaderPageType.BookingHistory);
	}

	public ngAfterViewInit() {
		this._bookingsTableComponent.bootstrap(this._bookingsService, this._tableBuilder.buildLazyLoadTableMeta());
	}
}