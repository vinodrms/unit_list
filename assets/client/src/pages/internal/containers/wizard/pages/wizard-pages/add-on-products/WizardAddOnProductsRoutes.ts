import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WizardAddOnProductsComponent}    from './WizardAddOnProductsComponent';

const wizardAddOnProductsRoutes: Routes = [
    { path: '', component: WizardAddOnProductsComponent }
];
export const wizardAddOnProductsRouting: ModuleWithProviders = RouterModule.forChild(wizardAddOnProductsRoutes);