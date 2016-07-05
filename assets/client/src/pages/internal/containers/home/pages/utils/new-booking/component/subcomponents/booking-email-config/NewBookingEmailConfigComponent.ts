import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {LazyLoadingTableComponent} from '../../../../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {BookingCartService} from '../../../services/search/BookingCartService';
import {BookingCartItemVM} from '../../../services/search/view-models/BookingCartItemVM';
import {BookingCartTableMetaBuilderService} from '../utils/table-builder/BookingCartTableMetaBuilderService';
import {BookingTableUtilsService} from '../utils/table-builder/BookingTableUtilsService';

@Component({
    selector: 'new-booking-email-config',
    templateUrl: '/client/src/pages/internal/containers/home/pages/utils/new-booking/component/subcomponents/booking-email-config/template/new-booking-email-config.html',
    directives: [LazyLoadingTableComponent],
    providers: [BookingCartTableMetaBuilderService, BookingTableUtilsService]
})
export class NewBookingEmailConfigComponent extends BaseComponent implements AfterViewInit {
    @ViewChild('bookingCartReadOnly') private _bookingCartTableComponent: LazyLoadingTableComponent<BookingCartItemVM>;

    constructor(private _appContext: AppContext, private _bookingCartService: BookingCartService,
        private _cartTableMetaBuilder: BookingCartTableMetaBuilderService, private _bookingTableUtilsService: BookingTableUtilsService) {
        super();
    }

    ngAfterViewInit() {
        this._bookingCartTableComponent.bootstrap(this._bookingCartService, this._cartTableMetaBuilder.buildReadOnlyBookingCartTableMeta());
        this._bookingCartTableComponent.attachCustomCellClassGenerator(this._bookingTableUtilsService.customCellClassGeneratorForBookingCart);
        this._bookingCartTableComponent.attachCustomRowClassGenerator(this._bookingTableUtilsService.customRowClassGeneratorForBookingCart);
        this._bookingCartTableComponent.attachCustomRowCommandPerformPolicy(this._bookingTableUtilsService.canPerformCommandOnItemForBookingCart);
    }

}