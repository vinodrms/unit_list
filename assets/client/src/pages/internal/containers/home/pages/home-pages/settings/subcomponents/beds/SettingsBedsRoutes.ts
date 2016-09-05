import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SettingsBedsComponent} from './SettingsBedsComponent';

const settingsBedsRoutes: Routes = [
    { path: '', component: SettingsBedsComponent }
];
export const settingsBedsRouting: ModuleWithProviders = RouterModule.forChild(settingsBedsRoutes);