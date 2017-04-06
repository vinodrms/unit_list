import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsReportsComponent } from './main/SettingsReportsComponent';
import { SettingsShiftReportComponent } from './pages/shift-report/SettingsShiftReportComponent';
import { SettingsBackUpReportComponent } from './pages/backup-report/SettingsBackUpReportComponent';
import { SettingsKeyMetricsReportComponent } from './pages/key-metrics-report/SettingsKeyMetricsReportComponent';
import { BookingsForPriceProductComponent } from "./pages/bookings-for-price-product/BookingsForPriceProductComponent";
import { SettingsHousekeepingReportComponent } from "./pages/housekeeping-report/SettingsHousekeepingReportComponent";

const settingsReportsRoutes: Routes = [
    {
        path: '', component: SettingsReportsComponent,
        children: [
            { path: '', redirectTo: 'shift', pathMatch: 'prefix' },
            { path: 'shift', component: SettingsShiftReportComponent },
            { path: 'backup', component: SettingsBackUpReportComponent },
            { path: 'key-metrics', component: SettingsKeyMetricsReportComponent },
            { path: 'bookings-for-price-product', component: BookingsForPriceProductComponent },
            { path: 'housekeeping', component: SettingsHousekeepingReportComponent },
        ]
    }
];
export const settingsReportsRouting: ModuleWithProviders = RouterModule.forChild(settingsReportsRoutes);