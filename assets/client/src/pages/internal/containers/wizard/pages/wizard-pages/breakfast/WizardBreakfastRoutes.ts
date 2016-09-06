import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WizardBreakfastComponent} from './WizardBreakfastComponent';

const wizardBreakfastRoutes: Routes = [
    { path: '', component: WizardBreakfastComponent }
];
export const wizardBreakfastRouting: ModuleWithProviders = RouterModule.forChild(wizardBreakfastRoutes);