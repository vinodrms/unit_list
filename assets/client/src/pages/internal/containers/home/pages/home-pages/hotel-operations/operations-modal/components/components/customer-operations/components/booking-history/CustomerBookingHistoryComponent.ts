import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {ThLongDateIntervalPipe} from '../../../../../../../../../../../../../common/utils/pipes/ThLongDateIntervalPipe';
import {AppContext, ThError} from '../../../../../../../../../../../../../common/utils/AppContext';
import {CustomerOperationsPageData} from '../../services/utils/CustomerOperationsPageData';
import {LazyLoadData} from '../../../../../../../../../../../services/common/ILazyLoadRequestService';
import {BookingsService} from '../../../../../../../../../../../services/bookings/BookingsService';
import {BookingVM} from '../../../../../../../../../../../services/bookings/view-models/BookingVM';
import {HotelOperationsPageControllerService} from '../../../../services/HotelOperationsPageControllerService';

@Component({
    selector: 'customer-booking-history',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/customer-operations/components/booking-history/template/customer-booking-history.html',
    providers: [BookingsService],
    pipes: [TranslationPipe, ThLongDateIntervalPipe]
})
export class CustomerBookingHistoryComponent implements OnInit {
    @Output() totalBookingsCountEmitter = new EventEmitter<number>();
    @Input() customerOperationsPageData: CustomerOperationsPageData;

    isLoading: boolean = false;
    private _pageNumber = 0;
    private _totalCount: number;

    bookingVMList: BookingVM[] = [];

    constructor(private _appContext: AppContext,
        private _bookingsService: BookingsService,
        private _operationsPageControllerService: HotelOperationsPageControllerService) { }

    ngOnInit() {
        this.isLoading = true;
        this._bookingsService.setCustomerIdFilter(this.customerOperationsPageData.customerVM.customer.id);
        this._bookingsService.getDataObservable().subscribe((lazyLoadData: LazyLoadData<BookingVM>) => {
            this.bookingVMList = this.bookingVMList.concat(lazyLoadData.pageContent.pageItemList);
            this.totalCount = lazyLoadData.totalCount.numOfItems;
            this.isLoading = false;
        });
        this._bookingsService.refreshData();
    }

    public get canLoadMore() {
        return this.bookingVMList.length < this._totalCount;
    }
    public loadMore() {
        if (!this.canLoadMore || this.isLoading) { return; }
        this.isLoading = true;
        this._pageNumber++;
        this._bookingsService.updatePageNumber(this._pageNumber);
    }

    public goToBooking(bookingVM: BookingVM) {
        this._operationsPageControllerService.goToBooking(bookingVM.booking.groupBookingId, bookingVM.booking.bookingId);
    }

    public get totalCount(): number {
        return this._totalCount;
    }
    public set totalCount(totalCount: number) {
        this.totalBookingsCountEmitter.next(totalCount);
        this._totalCount = totalCount;
    }
}