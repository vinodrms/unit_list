import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SettingsRoomsComponent} from './SettingsRoomsComponent';

const settingsRoomsRoutes: Routes = [
    { path: '', component: SettingsRoomsComponent }
];
export const settingsRoomsRouting: ModuleWithProviders = RouterModule.forChild(settingsRoomsRoutes);