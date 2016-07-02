import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {BookingCartService} from '../../../services/search/BookingCartService';
import {BookingCartItemVM} from '../../../services/search/view-models/BookingCartItemVM';
import {BookingCartTableMetaBuilderService} from '../utils/table-builder/BookingCartTableMetaBuilderService';
import {BookingTableUtilsService} from '../utils/table-builder/BookingTableUtilsService';

@Component({
	selector: 'new-booking-fill-details',
	templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-fill-details/template/new-booking-fill-details.html',
	directives: [LazyLoadingTableComponent],
	providers: [BookingCartTableMetaBuilderService, BookingTableUtilsService],
})
export class NewBookingFillDetailsComponent extends BaseComponent implements AfterViewInit {
	@ViewChild('bookingCartSelectable') private _bookingCartTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;

	constructor(private _bookingCartService: BookingCartService,
		private _cartTableMetaBuilder: BookingCartTableMetaBuilderService, private _bookingTableUtilsService: BookingTableUtilsService) {
		super();
	}

	public ngAfterViewInit() {
		this._bookingCartTableComponent.bootstrap(this._bookingCartService, this._cartTableMetaBuilder.buildBookingCartTableMeta());
		this._bookingCartTableComponent.attachCustomCellClassGenerator(this._bookingTableUtilsService.customCellClassGeneratorForBookingCart);
		this._bookingCartTableComponent.attachCustomRowClassGenerator(this._bookingTableUtilsService.customRowClassGeneratorForBookingCart);
		this._bookingCartTableComponent.attachCustomRowCommandPerformPolicy(this._bookingTableUtilsService.canPerformCommandOnItemForBookingCart);
	}

}