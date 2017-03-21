import {Component, OnInit, Input} from '@angular/core';
import {LoadingComponent} from '../../../../../../../../../../../common/utils/components/LoadingComponent';
import {ThError, AppContext} from '../../../../../../../../../../../common/utils/AppContext';
import {BookingDO} from '../../../../../../../../../services/bookings/data-objects/BookingDO';
import {BookingMeta} from '../../../../../../../../../services/bookings/data-objects/BookingMeta';
import {HotelBookingOperationsPageParam} from './utils/HotelBookingOperationsPageParam';
import {BookingOperationsPageService} from './services/BookingOperationsPageService';
import {BookingOperationsPageData} from './services/utils/BookingOperationsPageData';
import {HotelOperationsResultService} from '../../../services/HotelOperationsResultService';

@Component({
    selector: 'booking-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/template/booking-operations-page.html',
    providers: [BookingOperationsPageService]
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
        var title = " " + this._appContext.thTranslation.translate("ResNO") + " " + this.bookingDO.reservationNumber;
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