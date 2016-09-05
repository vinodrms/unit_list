import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WizardBasicInformationComponent} from './main/WizardBasicInformationComponent';
import {WizardBasicInfoIntroComponent} from './pages/intro/WizardBasicInfoIntroComponent';
import {WizardBasicInfoOverviewComponent} from './pages/overview/WizardBasicInfoOverviewComponent';
import {WizardBasicInfoPaymentsAndPoliciesComponent} from './pages/payments-policies/WizardBasicInfoPaymentsAndPoliciesComponent';
import {WizardBasicInfoPropertyDetailsComponent} from './pages/property-details/WizardBasicInfoPropertyDetailsComponent';

const wizardBasicInfoRoutes: Routes = [
    { path: '', redirectTo: 'intro', pathMatch: 'prefix' },
    { path: 'intro', component: WizardBasicInfoIntroComponent },
    { path: 'overview', component: WizardBasicInfoOverviewComponent },
    { path: 'payments-policies', component: WizardBasicInfoPaymentsAndPoliciesComponent },
    { path: 'property-details', component: WizardBasicInfoPropertyDetailsComponent }
];
export const wizardBasicInfoRouting: ModuleWithProviders = RouterModule.forChild(wizardBasicInfoRoutes);