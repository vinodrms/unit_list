import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WizardBedsComponent} from './WizardBedsComponent';

const wizardBedsRoutes: Routes = [
    { path: '', component: WizardBedsComponent }
];
export const wizardBedsRouting: ModuleWithProviders = RouterModule.forChild(wizardBedsRoutes);