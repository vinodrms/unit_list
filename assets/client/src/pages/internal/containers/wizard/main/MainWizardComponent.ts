import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {BaseComponent} from '../../../../../common/base/BaseComponent';
import {WizardHeaderComponent} from '../pages/utils/header/WizardHeaderComponent';
import {WizardNavbarComponent} from '../pages/utils/navbar/WizardNavbarComponent';
import {WizardStepsComponent} from '../pages/utils/wizard-steps/WizardStepsComponent';
import {WizardBasicInformationComponent} from '../pages/wizard-pages/basic-information/main/WizardBasicInformationComponent';
import {WizardBedsComponent} from '../pages/wizard-pages/beds/WizardBedsComponent';
import {WizardRoomsComponent} from '../pages/wizard-pages/rooms/WizardRoomsComponent';
import {WizardBreakfastComponent} from '../pages/wizard-pages/breakfast/WizardBreakfastComponent';
import {WizardAddOnProductsComponent} from '../pages/wizard-pages/add-on-products/WizardAddOnProductsComponent';
import {WizardPriceProductsComponent} from '../pages/wizard-pages/price-products/WizardPriceProductsComponent';
import {WizardCustomerRegisterComponent} from '../pages/wizard-pages/customer-register/WizardCustomerRegisterComponent';

import {WIZARD_BASIC_INFO_PAGES_PROVIDERS} from '../pages/wizard-pages/basic-information/main/services/WizardBasicInfoPagesProvider';
import {WizardBedsStateService} from '../pages/wizard-pages/beds/services/WizardBedsStateService';
import {WizardRoomsStateService} from '../pages/wizard-pages/rooms/services/WizardRoomsStateService';
import {WizardBreakfastStateService} from '../pages/wizard-pages/breakfast/services/WizardBreakfastStateService';
import {WizardAddOnProductsStateService} from '../pages/wizard-pages/add-on-products/services/WizardAddOnProductsStateService';
import {WizardPriceProductsStateService} from '../pages/wizard-pages/price-products/services/WizardPriceProductsStateService';
import {WizardCustomerRegisterStateService} from '../pages/wizard-pages/customer-register/services/WizardCustomerRegisterStateService';
import {WizardService} from '../pages/wizard-pages/services/WizardService';
import {SETTINGS_PROVIDERS} from '../../../services/settings/SettingsProviders';
import {TaxService} from '../../../services/taxes/TaxService';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../../services/hotel/HotelProviders';

@RouteConfig([
	{ path: '/basic-info/...', name: 'WizardBasicInformationComponent', component: WizardBasicInformationComponent, useAsDefault: true },
	{ path: '/beds', name: 'WizardBedsComponent', component: WizardBedsComponent },
    { path: '/rooms', name: 'WizardRoomsComponent', component: WizardRoomsComponent },
	{ path: '/breakfast', name: 'WizardBreakfastComponent', component: WizardBreakfastComponent },
	{ path: '/add-on-products', name: 'WizardAddOnProductsComponent', component: WizardAddOnProductsComponent },
	{ path: '/price-products', name: 'WizardPriceProductsComponent', component: WizardPriceProductsComponent },
	{ path: '/customer-register', name: 'WizardCustomerRegisterComponent', component: WizardCustomerRegisterComponent }
])

@Component({
	selector: 'main-wizard-component',
	templateUrl: '/client/src/pages/internal/containers/wizard/main/template/main-wizard-component.html',
	directives: [RouterOutlet, WizardHeaderComponent, WizardNavbarComponent, WizardStepsComponent, WizardPriceProductsComponent],
	providers: [SETTINGS_PROVIDERS, HOTEL_AGGREGATOR_PROVIDERS, TaxService, WIZARD_BASIC_INFO_PAGES_PROVIDERS,
		WizardBedsStateService, WizardRoomsStateService, WizardBreakfastStateService,
		WizardAddOnProductsStateService, WizardPriceProductsStateService, WizardCustomerRegisterStateService,
		WizardService]
})

export class MainWizardComponent extends BaseComponent {
	constructor() {
		super();
	}
}