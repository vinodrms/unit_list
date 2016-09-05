import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SettingsPriceProductsComponent}    from './SettingsPriceProductsComponent';

const settingsPriceProductsRoutes: Routes = [
    { path: '', component: SettingsPriceProductsComponent }
];
export const settingsPriceProductsRouting: ModuleWithProviders = RouterModule.forChild(settingsPriceProductsRoutes);