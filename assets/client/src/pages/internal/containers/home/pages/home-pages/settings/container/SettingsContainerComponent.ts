import {Component, OnInit} from 'angular2/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {SettingsNavbarComponent} from '../subcomponents/navbar/SettingsNavbarComponent';
import {SettingsNavbarService} from '../subcomponents/navbar/services/SettingsNavbarService';
import {SettingsBasicInformationComponent} from '../subcomponents/basic-information/main/SettingsBasicInformationComponent';
import {SettingsBedsComponent} from '../subcomponents/beds/SettingsBedsComponent';

@RouteConfig([
	{ path: '/basic-info/...', name: 'SettingsBasicInformationComponent', component: SettingsBasicInformationComponent, useAsDefault: true },
	{ path: '/beds', name: 'SettingsBedsComponent', component: SettingsBedsComponent },
    // { path: '/rooms', name: 'WizardRoomsComponent', component: WizardRoomsComponent },
	// { path: '/add-on-products', name: 'WizardAddOnProductsComponent', component: WizardAddOnProductsComponent },
	// { path: '/price-products', name: 'WizardPriceProductsComponent', component: WizardPriceProductsComponent },
	// { path: '/customer-register', name: 'WizardCustomerRegisterComponent', component: WizardCustomerRegisterComponent }
])

@Component({
	selector: 'settings-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/container/template/settings-container.html',
	directives: [ROUTER_DIRECTIVES, SettingsNavbarComponent],
	providers: [SettingsNavbarService]
})
export class SettingsContainerComponent implements OnInit {

	constructor() { }

	ngOnInit() { }
}