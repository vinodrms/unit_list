import { Component, OnInit, Output, EventEmitter, Inject, Input } from '@angular/core';
import { IHotelOperationsPageParam, HotelOperationsPageTitleMeta } from '../services/utils/IHotelOperationsPageParam';
import { HotelOperationsPageType } from '../services/utils/HotelOperationsPageType';

import { SETTINGS_PROVIDERS } from '../../../../../../../services/settings/SettingsProviders';
import { RoomCategoriesStatsService } from '../../../../../../../services/room-categories/RoomCategoriesStatsService';
import { BedsEagerService } from '../../../../../../../services/beds/BedsEagerService';
import { RoomsService } from '../../../../../../../services/rooms/RoomsService';
import { EagerCustomersService } from '../../../../../../../services/customers/EagerCustomersService';
import { EagerAllotmentsService } from '../../../../../../../services/allotments/EagerAllotmentsService';
import { EagerBookingsService } from '../../../../../../../services/bookings/EagerBookingsService';
import { EagerInvoiceGroupsServiceDeprecated } from '../../../../../../../services/invoices-deprecated/EagerInvoiceGroupsService';
import { InvoiceGroupsServiceDeprecated } from '../../../../../../../services/invoices-deprecated/InvoiceGroupsService';
import { HotelService } from '../../../../../../../services/hotel/HotelService';
import { HotelAggregatorService } from '../../../../../../../services/hotel/HotelAggregatorService';
import { EagerAddOnProductsService } from '../../../../../../../services/add-on-products/EagerAddOnProductsService';
import { EagerPriceProductsService } from '../../../../../../../services/price-products/EagerPriceProductsService';
import { RoomCategoriesService } from '../../../../../../../services/room-categories/RoomCategoriesService';
import { HotelOperationsRoomService } from '../../../../../../../services/hotel-operations/room/HotelOperationsRoomService';
import { HotelOperationsBookingService } from '../../../../../../../services/hotel-operations/booking/HotelOperationsBookingService';
import { HotelOperationsCustomerService } from '../../../../../../../services/hotel-operations/customer/HotelOperationsCustomerService';
import { HotelOperationsPageControllerService } from './services/HotelOperationsPageControllerService';

@Component({
    selector: 'hotel-operations',
    templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/template/hotel-operations.html',
    providers: [SETTINGS_PROVIDERS,
        RoomCategoriesStatsService, BedsEagerService, RoomsService,
        EagerCustomersService, EagerAllotmentsService, EagerAddOnProductsService, EagerPriceProductsService,
        HotelService, HotelAggregatorService, EagerBookingsService, RoomCategoriesService,
        EagerInvoiceGroupsServiceDeprecated, InvoiceGroupsServiceDeprecated, HotelOperationsRoomService,
        HotelOperationsBookingService, HotelOperationsCustomerService, HotelOperationsPageControllerService]
})
export class HotelOperationsComponent {

    public removeHeaderFilter() {
        this.currentHotelOperationsPageParam.onFilterRemovedHandler();
    };

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

    public isInvoiceOperationsPageDeprecated(): boolean {
        return this.currentHotelOperationsPageParam.pageType === HotelOperationsPageType.InvoiceOperationsDeprecated;
    }

    private get currentHotelOperationsPageParam(): IHotelOperationsPageParam {
        return this._hotelOperationsPageController.currentHotelOperationsPageParam;
    }
}
