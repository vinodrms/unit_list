import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsContainerComponent} from './container/SettingsContainerComponent';

import {SettingsBasicInformationModule} from './subcomponents/basic-information/SettingsBasicInformationModule';
import {SettingsBedsModule} from './subcomponents/beds/SettingsBedsModule';
import {SettingsRoomsModule} from './subcomponents/rooms/SettingsRoomsModule';
import {SettingsBreakfastModule} from './subcomponents/breakfast/SettingsBreakfastModule';
import {SettingsAddOnProductsModule} from './subcomponents/add-on-products/SettingsAddOnProductsModule';
import {SettingsPriceProductsModule} from './subcomponents/price-products/SettingsPriceProductsModule';
import {SettingsCustomerRegisterModule} from './subcomponents/customer-register/SettingsCustomerRegisterModule';
import {SettingsAllotmentsModule} from './subcomponents/allotments/SettingsAllotmentsModule';
import {SettingsReportsModule} from './subcomponents/reports/SettingsReportsModule';

const settingsRoutes: Routes = [
    {
        path: '', component: SettingsContainerComponent,
        children: [
            { path: '', redirectTo: 'basic-info', pathMatch: 'prefix' },
            { path: 'basic-info', loadChildren: () => SettingsBasicInformationModule },
            { path: 'beds', loadChildren: () => SettingsBedsModule },
            { path: 'rooms', loadChildren: () => SettingsRoomsModule },
            { path: 'breakfast', loadChildren: () => SettingsBreakfastModule },
            { path: 'add-on-products', loadChildren: () => SettingsAddOnProductsModule },
            { path: 'price-products', loadChildren: () => SettingsPriceProductsModule },
            { path: 'customer-register', loadChildren: () => SettingsCustomerRegisterModule },
            { path: 'allotments', loadChildren: () => SettingsAllotmentsModule },
            { path: 'reports', loadChildren: () => SettingsReportsModule }
        ]
    }
];
export const settingsRouting: ModuleWithProviders = RouterModule.forChild(settingsRoutes);