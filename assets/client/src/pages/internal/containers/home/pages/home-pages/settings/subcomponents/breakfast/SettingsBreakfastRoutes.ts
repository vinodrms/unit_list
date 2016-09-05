import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SettingsBreakfastComponent} from './SettingsBreakfastComponent';

const settingsBreakfastRoutes: Routes = [
    { path: '', component: SettingsBreakfastComponent }
];
export const settingsBreakfastRouting: ModuleWithProviders = RouterModule.forChild(settingsBreakfastRoutes);