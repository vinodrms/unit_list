import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WizardAllotmentsComponent} from './WizardAllotmentsComponent';

const wizardAllotmentsRoutes: Routes = [
    { path: '', component: WizardAllotmentsComponent }
];
export const wizardAllotmentsRouting: ModuleWithProviders = RouterModule.forChild(wizardAllotmentsRoutes);