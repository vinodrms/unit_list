import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SettingsReportsComponent} from './main/SettingsReportsComponent';
import {SettingsShiftReportComponent} from './pages/shift-report/SettingsShiftReportComponent';
import {SettingsBackUpReportComponent} from './pages/backup-report/SettingsBackUpReportComponent';
import {SettingsKeyMetricsReportComponent} from './pages/key-metrics-report/SettingsKeyMetricsReportComponent';

const settingsReportsRoutes: Routes = [
    {
        path: '', component: SettingsReportsComponent,
        children: [
            { path: '', redirectTo: 'shift', pathMatch: 'prefix' },
            { path: 'shift', component: SettingsShiftReportComponent }
            // { path: 'backup', component: SettingsBackUpReportComponent },
            // { path: 'key-metrics', component: SettingsKeyMetricsReportComponent }
        ]
    }
];
export const settingsReportsRouting: ModuleWithProviders = RouterModule.forChild(settingsReportsRoutes);