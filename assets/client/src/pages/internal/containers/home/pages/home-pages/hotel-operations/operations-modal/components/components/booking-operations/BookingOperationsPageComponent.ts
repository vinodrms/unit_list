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

@Component({
    selector: 'booking-operations-page',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/booking-operations/template/booking-operations-page.html',
    directives: [LoadingComponent, CustomScroll, BookingPeriodEditorComponent],
    providers: [BookingOperationsPageService],
    pipes: [TranslationPipe]
})
export class BookingOperationsPageComponent implements OnInit {
    @Input() bookingOperationsPageParam: HotelBookingOperationsPageParam;

    isLoading: boolean;
    didInitOnce: boolean = false;

    bookingOperationsPageData: BookingOperationsPageData;

    constructor(private _appContext: AppContext,
        private _bookingOperationsPageService: BookingOperationsPageService) { }

    ngOnInit() {
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

}