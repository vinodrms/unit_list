import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainWizardComponent} from './main/MainWizardComponent';

import {WizardBasicInformationModule} from './pages/wizard-pages/basic-information/WizardBasicInformationModule';
import {WizardBedsModule} from './pages/wizard-pages/beds/WizardBedsModule';
import {WizardRoomsModule} from './pages/wizard-pages/rooms/WizardRoomsModule';
import {WizardBreakfastModule} from './pages/wizard-pages/breakfast/WizardBreakfastModule';
import {WizardAddOnProductsModule} from './pages/wizard-pages/add-on-products/WizardAddOnProductsModule';
import {WizardPriceProductsModule} from './pages/wizard-pages/price-products/WizardPriceProductsModule';
import {WizardCustomerRegisterModule} from './pages/wizard-pages/customer-register/WizardCustomerRegisterModule';
import {WizardAllotmentsModule} from './pages/wizard-pages/allotments/WizardAllotmentsModule';

const wizardRoutes: Routes = [
    {
        path: 'wizard', component: MainWizardComponent,
        children: [
            { path: '', redirectTo: 'basic-info', pathMatch: 'prefix' },
            { path: 'basic-info', loadChildren: () => WizardBasicInformationModule },
            { path: 'beds', loadChildren: () => WizardBedsModule },
            { path: 'rooms', loadChildren: () => WizardRoomsModule },
            { path: 'breakfast', loadChildren: () => WizardBreakfastModule },
            { path: 'add-on-products', loadChildren: () => WizardAddOnProductsModule },
            { path: 'price-products', loadChildren: () => WizardPriceProductsModule },
            { path: 'customer-register', loadChildren: () => WizardCustomerRegisterModule },
            { path: 'allotments', loadChildren: () => WizardAllotmentsModule }
        ]
    }
];
export const wizardRouting: ModuleWithProviders = RouterModule.forChild(wizardRoutes);