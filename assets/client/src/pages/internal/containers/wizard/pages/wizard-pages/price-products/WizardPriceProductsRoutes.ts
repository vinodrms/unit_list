import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WizardPriceProductsComponent}    from './WizardPriceProductsComponent';

const wizardPriceProductsRoutes: Routes = [
    { path: '', component: WizardPriceProductsComponent }
];
export const wizardPriceProductsRouting: ModuleWithProviders = RouterModule.forChild(wizardPriceProductsRoutes);