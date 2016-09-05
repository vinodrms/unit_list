import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SettingsAddOnProductsComponent}    from './SettingsAddOnProductsComponent';

const settingsAddOnProductsRoutes: Routes = [
    { path: '', component: SettingsAddOnProductsComponent }
];
export const settingsAddOnProductsRouting: ModuleWithProviders = RouterModule.forChild(settingsAddOnProductsRoutes);