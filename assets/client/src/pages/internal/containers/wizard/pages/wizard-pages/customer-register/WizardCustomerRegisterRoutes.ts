import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WizardCustomerRegisterComponent}    from './WizardCustomerRegisterComponent';

const wizardCustomerRegisterRoutes: Routes = [
    { path: '', component: WizardCustomerRegisterComponent }
];
export const wizardCustomerRegisterRouting: ModuleWithProviders = RouterModule.forChild(wizardCustomerRegisterRoutes);