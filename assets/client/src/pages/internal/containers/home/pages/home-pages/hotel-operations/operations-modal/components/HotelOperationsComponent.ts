import {Component, OnInit, Output, EventEmitter, Inject} from '@angular/core';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';

import {SETTINGS_PROVIDERS} from '../../../../../../../services/settings/SettingsProviders';
import {RoomCategoriesStatsService} from '../../../../../../../services/room-categories/RoomCategoriesStatsService';
import {BedsEagerService} from '../../../../../../../services/beds/BedsEagerService';
import {RoomsService} from '../../../../../../../services/rooms/RoomsService';
import {EagerCustomersService} from '../../../../../../../services/customers/EagerCustomersService';
import {EagerAllotmentsService} from '../../../../../../../services/allotments/EagerAllotmentsService';
import {EagerBookingsService} from '../../../../../../../services/bookings/EagerBookingsService';
import {EagerInvoiceGroupsService} from '../../../../../../../services/invoices/EagerInvoiceGroupsService';
import {HotelService} from '../../../../../../../services/hotel/HotelService';
import {HotelAggregatorService} from '../../../../../../../services/hotel/HotelAggregatorService';
import {EagerPriceProductsService} from '../../../../../../../services/price-products/EagerPriceProductsService';
import {RoomCategoriesService} from '../../../../../../../services/room-categories/RoomCategoriesService';

import {HotelOperationsRoomService} from '../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import {HotelOperationsBookingService} from '../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import {HotelOperationsCustomerService} from '../../../../../../../services/hotel-operations/customer/HotelOperationsCustomerService';

import {RoomOperationsPageComponent} from './components/room-operations/RoomOperationsPageComponent';
import {BookingOperationsPageComponent} from './components/booking-operations/BookingOperationsPageComponent';
import {CustomerOperationsPageComponent} from './components/customer-operations/CustomerOperationsPageComponent';
import {InvoiceOperationsPageComponent} from './components/invoice-operations/InvoiceOperationsPageComponent';

import {HotelOperationsPageControllerService} from './services/HotelOperationsPageControllerService';
import {IHotelOperationsPageParam, HotelOperationsPageTitleMeta} from '../services/utils/IHotelOperationsPageParam';
import {HotelOperationsPageType} from '../services/utils/HotelOperationsPageType';

@Component({
    selector: 'hotel-operations',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/template/hotel-operations.html',
    directives: [RoomOperationsPageComponent, BookingOperationsPageComponent, CustomerOperationsPageComponent, InvoiceOperationsPageComponent],
    providers: [SETTINGS_PROVIDERS,
        RoomCategoriesStatsService, BedsEagerService, RoomsService, 
        EagerCustomersService, EagerAllotmentsService, EagerPriceProductsService,
        HotelService, HotelAggregatorService, EagerBookingsService, RoomCategoriesService,
        EagerInvoiceGroupsService, HotelOperationsRoomService, 
        HotelOperationsBookingService, HotelOperationsCustomerService, HotelOperationsPageControllerService],
    pipes: [TranslationPipe]
})
export class HotelOperationsComponent {
    @Output() onExit = new EventEmitter<boolean>();
    public triggerOnExit() {
        this.onExit.next(true);
    }

    constructor( @Inject(IHotelOperationsPageParam) public hotelOperationsPageParam: IHotelOperationsPageParam,
        private _hotelOperationsPageController: HotelOperationsPageControllerService) {
        this._hotelOperationsPageController.bootstrap(hotelOperationsPageParam);
    }

    public canGoBack() {
        return this._hotelOperationsPageController.canGoBack();
    }
    public goBack() {
        this._hotelOperationsPageController.goBack();
    }

    public get titleMeta(): HotelOperationsPageTitleMeta {
        return this.currentHotelOperationsPageParam.titleMeta;
    }

    public isRoomOperationsPage(): boolean {
        return this.currentHotelOperationsPageParam.pageType === HotelOperationsPageType.RoomOperations;
    }
    public isBookingOperationsPage(): boolean {
        return this.currentHotelOperationsPageParam.pageType === HotelOperationsPageType.BookingOperations;
    }
    public isCustomerOperationsPage(): boolean {
        return this.currentHotelOperationsPageParam.pageType === HotelOperationsPageType.CustomerOperations;
    }
    public isInvoiceOperationsPage(): boolean {
        return this.currentHotelOperationsPageParam.pageType === HotelOperationsPageType.InvoiceOperations;
    }

    private get currentHotelOperationsPageParam(): IHotelOperationsPageParam {
        return this._hotelOperationsPageController.currentHotelOperationsPageParam;
    }
}