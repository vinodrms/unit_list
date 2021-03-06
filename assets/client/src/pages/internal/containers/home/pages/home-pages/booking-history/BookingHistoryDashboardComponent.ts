import { Component, AfterViewInit, ViewChild, ReflectiveInjector, Type, ResolvedReflectiveProvider } from '@angular/core';
import { LazyLoadingTableComponent } from '../../../../../../../common/utils/components/lazy-loading/LazyLoadingTableComponent';
import { HeaderPageService } from '../../utils/header/container/services/HeaderPageService';
import { HeaderPageType } from '../../utils/header/container/services/HeaderPageType';
import { AHomeContainerComponent } from '../../utils/AHomeContainerComponent';
import { BookingsService } from '../../../../../services/bookings/BookingsService';
import { BookingVM } from '../../../../../services/bookings/view-models/BookingVM';
import { EagerCustomersService } from '../../../../../services/customers/EagerCustomersService';
import { BookingsTableMetaBuilderService } from './services/BookingsTableMetaBuilderService';
import { NewBookingModalService } from '../../utils/new-booking/modal/services/NewBookingModalService';
import { NewBookingResult } from '../../utils/new-booking/modal/services/utils/NewBookingResult';
import { ModalDialogRef } from '../../../../../../../common/utils/modals/utils/ModalDialogRef';
import { BookingOverviewComponent } from './components/booking-overview/BookingOverviewComponent';
import { BookingsDateFilterComponent } from './components/bookings-date-filter/BookingsDateFilterComponent';
import { BookingsDateFilterModule } from './components/bookings-date-filter/BookingsDateFilterModule';
import { HotelOperationsModalService } from '../hotel-operations/operations-modal/services/HotelOperationsModalService';
import { HotelOperationsResult } from '../hotel-operations/operations-modal/services/utils/HotelOperationsResult';
import { NewBookingModalInput } from "../../utils/new-booking/modal/services/utils/NewBookingModalInput";

@Component({
    selector: 'booking-history-dashboard',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/booking-history/template/booking-history-dashboard.html',
    providers: [EagerCustomersService, BookingsService, BookingsTableMetaBuilderService, NewBookingModalService, HotelOperationsModalService]
})
export class BookingHistoryDashboardComponent extends AHomeContainerComponent implements AfterViewInit {
    @ViewChild(LazyLoadingTableComponent)
    private _bookingsTableComponent: LazyLoadingTableComponent<BookingVM>;

    selectedBookingVM: BookingVM;

    constructor(headerPageService: HeaderPageService,
        private _bookingsService: BookingsService,
        private _tableBuilder: BookingsTableMetaBuilderService,
        private _newBookingModalService: NewBookingModalService,
        private _hotelOperationsModalService: HotelOperationsModalService) {
        super(headerPageService, HeaderPageType.BookingHistory);
    }

    public ngAfterViewInit() {
        this._bookingsTableComponent.attachTopTableCenterBootstrapData({
            moduleToInject: BookingsDateFilterModule,
            componentType: BookingsDateFilterComponent,
            providers: ReflectiveInjector.resolve([{ provide: BookingsService, useValue: this._bookingsService }])
        });
        this._bookingsTableComponent.bootstrap(this._bookingsService, this._tableBuilder.buildLazyLoadTableMeta());
    }

    public openNewBookingModal(newBookingModalInput?: NewBookingModalInput) {
        this._newBookingModalService.openNewBookingModal(newBookingModalInput).then((modalDialogInstance: ModalDialogRef<NewBookingResult>) => {
            modalDialogInstance.resultObservable.subscribe((newBookingResult: NewBookingResult) => {
                this._bookingsService.refreshData();
            });
        }).catch((e: any) => { });
    }
    public selectBooking(bookingVM: BookingVM) {
        this.selectedBookingVM = bookingVM;
    }
    public editBooking(bookingVM: BookingVM) {
        this._hotelOperationsModalService.openBookingOperationsModal(bookingVM.booking.id).then((modalDialogRef: ModalDialogRef<HotelOperationsResult>) => {
            modalDialogRef.resultObservable
                .subscribe((result: HotelOperationsResult) => {
                    if (result.didChangeBooking) {
                        this._bookingsTableComponent.deselectItem();
                        this.selectedBookingVM = null;
                        this._bookingsService.refreshData();
                    }
                }, (err: any) => {
                });
        }).catch((err: any) => { });
    }
    public addBookingToGroup(bookingVM: BookingVM) {
        let newBookingModalInput = new NewBookingModalInput();
        newBookingModalInput.groupBookingId = bookingVM.booking.groupBookingId;

        this.openNewBookingModal(newBookingModalInput);
    }
}
