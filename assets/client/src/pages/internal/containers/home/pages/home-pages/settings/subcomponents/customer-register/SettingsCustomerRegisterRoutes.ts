import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SettingsCustomerRegisterComponent}    from './SettingsCustomerRegisterComponent';

const settingsCustomerRegisterRoutes: Routes = [
    { path: '', component: SettingsCustomerRegisterComponent }
];
export const settingsCustomerRegisterRouting: ModuleWithProviders = RouterModule.forChild(settingsCustomerRegisterRoutes);