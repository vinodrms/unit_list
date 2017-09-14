import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MainHomeComponent} from './main/MainHomeComponent';
import {HotelOperationsDashboardComponent} from './pages/home-pages/hotel-operations/dashboard/HotelOperationsDashboardComponent';
import {YieldManagerDashboardComponent} from './pages/home-pages/yield-manager/dashboard/YieldManagerDashboardComponent';
import {BookingHistoryDashboardComponent} from './pages/home-pages/booking-history/BookingHistoryDashboardComponent';
import { SettingsModule } from './pages/home-pages/settings/SettingsModule';
import { InvoiceHistoryDashboardComponent } from "./pages/home-pages/invoices-history/InvoiceHistoryDashboardComponent";

const homeRoutes: Routes = [
    {
        path: '',
        component: MainHomeComponent,
        children: [
            { path: '', redirectTo: 'operations', pathMatch: 'prefix' },
            { path: 'operations', component: HotelOperationsDashboardComponent },
            { path: 'yield-manager', component: YieldManagerDashboardComponent },
            { path: 'bookings', component: BookingHistoryDashboardComponent },
            { path: 'invoices', component: InvoiceHistoryDashboardComponent },
            { path: 'settings', loadChildren: () => SettingsModule }
        ]
    }
];
export const homeRouting: ModuleWithProviders = RouterModule.forChild(homeRoutes);