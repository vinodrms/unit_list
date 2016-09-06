import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {SharedPipesModule} from '../../../../common/utils/pipes/modules/SharedPipesModule';
import {SharedDirectivesModule} from '../../../../common/utils/directives/modules/SharedDirectivesModule';
import {SharedComponentsModule} from '../../../../common/utils/components/modules/SharedComponentsModule';

import {SETTINGS_PROVIDERS} from '../../services/settings/SettingsProviders';
import {WIZARD_BASIC_INFO_PAGES_PROVIDERS} from './pages/wizard-pages/basic-information/main/services/WizardBasicInfoPagesProvider';
import {WizardBedsStateService} from './pages/wizard-pages/beds/services/WizardBedsStateService';
import {WizardRoomsStateService} from './pages/wizard-pages/rooms/services/WizardRoomsStateService';
import {WizardBreakfastStateService} from './pages/wizard-pages/breakfast/services/WizardBreakfastStateService';
import {WizardAddOnProductsStateService} from './pages/wizard-pages/add-on-products/services/WizardAddOnProductsStateService';
import {WizardPriceProductsStateService} from './pages/wizard-pages/price-products/services/WizardPriceProductsStateService';
import {WizardCustomerRegisterStateService} from './pages/wizard-pages/customer-register/services/WizardCustomerRegisterStateService';
import {WizardAllotmentsStateService} from './pages/wizard-pages/allotments/services/WizardAllotmentsStateService';
import {WizardService} from './pages/wizard-pages/services/WizardService';
import {TaxService} from './../../services/taxes/TaxService';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../services/hotel/HotelProviders';
import {RoomCategoriesService} from '../../services/room-categories/RoomCategoriesService';
import {RoomCategoriesStatsService} from '../../services/room-categories/RoomCategoriesStatsService';

import {MainWizardComponent} from './main/MainWizardComponent';
import {WizardHeaderComponent} from './pages/utils/header/WizardHeaderComponent';
import {WizardNavbarComponent} from './pages/utils/navbar/WizardNavbarComponent';
import {wizardRouting} from './WizardRoutes';

const MainWizardModuleDeclarations = [
    MainWizardComponent,
    WizardHeaderComponent,
    WizardNavbarComponent
];

@NgModule({
    imports: [CommonModule, FormsModule,
        SharedPipesModule, SharedDirectivesModule, SharedComponentsModule,
        wizardRouting],
    declarations: [MainWizardModuleDeclarations],
    providers: [SETTINGS_PROVIDERS, HOTEL_AGGREGATOR_PROVIDERS, TaxService,
        RoomCategoriesService, RoomCategoriesStatsService, WIZARD_BASIC_INFO_PAGES_PROVIDERS,
        WizardBedsStateService, WizardRoomsStateService, WizardBreakfastStateService,
        WizardAddOnProductsStateService, WizardPriceProductsStateService,
        WizardCustomerRegisterStateService, WizardAllotmentsStateService,
        WizardService],
})
export class WizardModule { }