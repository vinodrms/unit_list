import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WizardRoomsComponent} from './WizardRoomsComponent';

const wizardRoomsRoutes: Routes = [
    { path: '', component: WizardRoomsComponent }
];
export const wizardRoomsRouting: ModuleWithProviders = RouterModule.forChild(wizardRoomsRoutes);