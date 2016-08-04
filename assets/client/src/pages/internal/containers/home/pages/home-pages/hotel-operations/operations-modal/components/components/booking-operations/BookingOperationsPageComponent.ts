import {Component, OnInit, Input} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {CustomScroll} from '../../../../../../../../../../../common/utils/directives/CustomScroll';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {BookingDO} from '../../../../../../../../../services/bookings/data-objects/BookingDO';
import {BookingMeta} from '../../../../../../../../../services/bookings/data-objects/BookingMeta';
import {HotelBookingOperationsPageParam} from './utils/HotelBookingOperationsPageParam';
import {BookingOperationsPageService} from './services/BookingOperationsPageService';
import {BookingOperationsPageData} from './services/utils/BookingOperationsPageData';
import {BookingPeriodEditorComponent} from './components/period-editor/BookingPeriodEditorComponent';
import {DocumentHistoryViewerComponent} from '../../../../../../../../../../../common/utils/components/document-history/DocumentHistoryViewerComponent';
import {HotelOperationsResultService} from '../../../services/HotelOperationsResultService';
import {BookingNoShowEditorComponent} from './components/no-show-edit/BookingNoShowEditorComponent';
import {BookingRoomEditorComponent} from './components/room-edit/BookingRoomEditorComponent';
import {BookingCapacityEditorComponent} from './components/capacity-edit/BookingCapacityEditorComponent';
import {BookingPaymentGuaranteeEditorComponent} from './components/payment-guarantee-edit/BookingPaymentGuaranteeEditorComponent';
import {BookingDetailsEditorComponent} from './components/booking-details/BookingDetailsEditorComponent';
import {BookingPriceProductViewerComponent} from './components/price-product-view/BookingPriceProductViewerComponent';
import {BookingAllotmentViewerComponent} from './components/allotment-view/BookingAllotmentViewerComponent';
import {BookingCustomerEditorComponent} from './components/customers-edit/BookingCustomerEditorComponent';
import {BookingReactivateComponent} from './components/reactivate/BookingReactivateComponent';
import {BookingCancelComponent} from './components/cancel/BookingCancelComponent';
import {BookingSendConfirmationComponent} from './components/send-confirmation/BookingSendConfirmationComponent';
import {BookingLinksComponent} from './components/booking-links/BookingLinksComponent';

@Component({
    selector: 'booking-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/template/booking-operations-page.html',
    directives: [LoadingComponent, CustomScroll,
        BookingPeriodEditorComponent, BookingNoShowEditorComponent, BookingRoomEditorComponent,
        BookingCapacityEditorComponent, BookingPaymentGuaranteeEditorComponent, BookingDetailsEditorComponent,
        BookingPriceProductViewerComponent, BookingAllotmentViewerComponent, DocumentHistoryViewerComponent,
        BookingCustomerEditorComponent, BookingReactivateComponent, BookingCancelComponent,
        BookingSendConfirmationComponent, BookingLinksComponent],
    providers: [BookingOperationsPageService],
    pipes: [TranslationPipe]
})
export class BookingOperationsPageComponent implements OnInit {
    @Input() bookingOperationsPageParam: HotelBookingOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;

    bookingOperationsPageData: BookingOperationsPageData;

    constructor(private _appContext: AppContext,
        private _hotelOperationsResultService: HotelOperationsResultService,
        private _bookingOperationsPageService: BookingOperationsPageService) { }

    ngOnInit() {
        this.loadPageData();
        this._appContext.analytics.logPageView("/operations/bookings");
    }
    public loadPageData() {
        this.isLoading = true;
        this._bookingOperationsPageService.getPageData(this.bookingOperationsPageParam).subscribe((pageData: BookingOperationsPageData) => {
            this.bookingOperationsPageData = pageData;
            this.isLoading = false;
            this.didInitOnce = true;
            this.updateContainerData();
        }, (err: ThError) => {
            this._appContext.toaster.error(err.message);
            this.isLoading = false;
        });
    }
    private updateContainerData() {
        var title = this.bookingDO.groupBookingReference + " / " + this.bookingDO.bookingReference;
        var subtitle = this._appContext.thTranslation.translate(this.bookingMeta.displayName);
        this.bookingOperationsPageParam.updateTitle(title, subtitle);
    }

    public get bookingDO(): BookingDO {
        return this.bookingOperationsPageData.bookingDO;
    }
    public get bookingMeta(): BookingMeta {
        return this.bookingOperationsPageData.bookingMeta;
    }

    public didChangeBooking(booking: BookingDO): boolean {
        this.bookingOperationsPageData.bookingDO = booking;
        this.bookingOperationsPageData = this.bookingOperationsPageData.buildPrototype();
        this._hotelOperationsResultService.markBookingChanged(booking);
        this.updateContainerData();
        return true;
    }
}