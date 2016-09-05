import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SettingsBasicInformationComponent} from './main/SettingsBasicInformationComponent';
import {SettingsBasicInfoOverviewComponent} from './pages/overview/SettingsBasicInfoOverviewComponent';
import {SettingsBasicInfoPaymentsAndPoliciesComponent} from './pages/payments-policies/SettingsBasicInfoPaymentsAndPoliciesComponent';
import {SettingsBasicInfoPropertyDetailsComponent} from './pages/property-details/SettingsBasicInfoPropertyDetailsComponent';

const settingsBasicInfoRoutes: Routes = [
    {
        path: '', component: SettingsBasicInformationComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'prefix' },
            { path: 'overview', component: SettingsBasicInfoOverviewComponent },
            { path: 'payments-policies', component: SettingsBasicInfoPaymentsAndPoliciesComponent },
            { path: 'property-details', component: SettingsBasicInfoPropertyDetailsComponent }
        ]
    }
];
export const settingsBasicInfoRouting: ModuleWithProviders = RouterModule.forChild(settingsBasicInfoRoutes);