import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsReportsComponent } from './main/SettingsReportsComponent';
import { SettingsShiftReportComponent } from './pages/shift-report/SettingsShiftReportComponent';
import { SettingsBackUpReportComponent } from './pages/backup-report/SettingsBackUpReportComponent';
import { SettingsKeyMetricsReportComponent } from './pages/key-metrics-report/SettingsKeyMetricsReportComponent';
import { SettingsHousekeepingReportComponent } from "./pages/housekeeping-report/SettingsHousekeepingReportComponent";
import { BookingsReportComponent } from "./pages/bookings-report/BookingsReportComponent";
import { InvoicesReportComponent } from "./pages/invoices-report/InvoicesReportComponent";
import { SettingsGuestsReportComponent } from "./pages/guests-report/SettingsGuestsReportComponent";

const settingsReportsRoutes: Routes = [
    {
        path: '', component: SettingsReportsComponent,
        children: [
            { path: '', redirectTo: 'shift', pathMatch: 'prefix' },
            { path: 'shift', component: SettingsShiftReportComponent },
            { path: 'backup', component: SettingsBackUpReportComponent },
            { path: 'guests', component: SettingsGuestsReportComponent },
            { path: 'key-metrics', component: SettingsKeyMetricsReportComponent },
            { path: 'housekeeping', component: SettingsHousekeepingReportComponent },
            { path: 'bookings', component: BookingsReportComponent },
            { path: 'invoices', component: InvoicesReportComponent },
            
        ]
    }
];
export const settingsReportsRouting: ModuleWithProviders = RouterModule.forChild(settingsReportsRoutes);