import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SettingsAllotmentsComponent} from './SettingsAllotmentsComponent';

const settingsAllotmentsRoutes: Routes = [
    { path: '', component: SettingsAllotmentsComponent }
];
export const settingsAllotmentsRouting: ModuleWithProviders = RouterModule.forChild(settingsAllotmentsRoutes);