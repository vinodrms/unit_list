import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsContainerComponent} from './container/SettingsContainerComponent';

import {SettingsBasicInformationModule} from './subcomponents/basic-information/SettingsBasicInformationModule';
import {SettingsBedsModule} from './subcomponents/beds/SettingsBedsModule';

const settingsRoutes: Routes = [
    {
        path: '', component: SettingsContainerComponent,
        children: [
            { path: '', redirectTo: 'basic-info', pathMatch: 'prefix' },
            { path: 'basic-info', loadChildren: () => SettingsBasicInformationModule },
            { path: 'beds', loadChildren: () => SettingsBedsModule },
            // { path: 'rooms', loadChildren: () => WizardRoomsModule },
            // { path: 'breakfast', loadChildren: () => WizardBreakfastModule },
            // { path: 'add-on-products', loadChildren: () => WizardAddOnProductsModule },
            // { path: 'price-products', loadChildren: () => WizardPriceProductsModule },
            // { path: 'customer-register', loadChildren: () => WizardCustomerRegisterModule },
            // { path: 'allotments', loadChildren: () => WizardAllotmentsModule }
        ]
    }
];
export const settingsRouting: ModuleWithProviders = RouterModule.forChild(settingsRoutes);