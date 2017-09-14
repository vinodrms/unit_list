import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../common/utils/components/modules/SharedComponentsModule';

import {HotelOperationsDashboardModule} from './pages/home-pages/hotel-operations/dashboard/HotelOperationsDashboardModule';
import {BookingHistoryDashboardModule} from './pages/home-pages/booking-history/BookingHistoryDashboardModule';
import {YieldManagerDashboardModule} from './pages/home-pages/yield-manager/dashboard/YieldManagerDashboardModule';

import {MainHomeComponent} from './main/MainHomeComponent';
import {HomeHeaderModule} from './pages/utils/header/HomeHeaderModule';

import {homeRouting} from './HomeRoutes';
import {HeaderPageService} from './pages/utils/header/container/services/HeaderPageService';
import {SETTINGS_PROVIDERS} from './../../services/settings/SettingsProviders';
import {TaxService} from '../../services/taxes/TaxService';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../services/hotel/HotelProviders';
import {RoomCategoriesService} from '../../services/room-categories/RoomCategoriesService';
import {RoomCategoriesStatsService} from '../../services/room-categories/RoomCategoriesStatsService';
import {ISocketsService} from '../../../../common/utils/sockets/ISocketsService';
import { SocketsService } from '../../../../common/utils/sockets/SocketsService';
import { InvoiceHistoryDashboardModule } from "./pages/home-pages/invoices-history/InvoiceHistoryDashboardModule";

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule,
        HomeHeaderModule,
        HotelOperationsDashboardModule,
        YieldManagerDashboardModule,
        BookingHistoryDashboardModule,
        InvoiceHistoryDashboardModule,
        homeRouting],
    declarations: [MainHomeComponent],
    providers: [HeaderPageService, { provide: ISocketsService, useClass: SocketsService },
        SETTINGS_PROVIDERS, HOTEL_AGGREGATOR_PROVIDERS, TaxService, RoomCategoriesService,
        RoomCategoriesStatsService],
})
export class HomeModule { }