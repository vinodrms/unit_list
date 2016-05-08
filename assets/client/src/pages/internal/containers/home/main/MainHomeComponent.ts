import {Component, OnInit} from '@angular/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {BaseComponent} from '../../../../../common/base/BaseComponent';
import {MainHeaderComponent} from '../pages/utils/header/MainHeaderComponent';
import {HotelOperationsContainerComponent} from '../pages/home-pages/hotel-operations/container/HotelOperationsContainerComponent';
import {SettingsContainerComponent} from '../pages/home-pages/settings/container/SettingsContainerComponent';
import {SETTINGS_PROVIDERS} from '../../../services/settings/SettingsProviders';
import {TaxService} from '../../../services/taxes/TaxService';
import {HOTEL_AGGREGATOR_PROVIDERS} from '../../../services/hotel/HotelProviders';

@RouteConfig([
	{ path: '/operations', name: 'HotelOperationsContainerComponent', component: HotelOperationsContainerComponent, useAsDefault: true },
	{ path: '/settings/...', name: 'SettingsContainerComponent', component: SettingsContainerComponent }
])

@Component({
	selector: 'main-home-component',
	templateUrl: '/client/src/pages/internal/containers/home/main/template/main-home-component.html',
	providers: [SETTINGS_PROVIDERS, HOTEL_AGGREGATOR_PROVIDERS, TaxService],
	directives: [MainHeaderComponent, ROUTER_DIRECTIVES]
})

export class MainHomeComponent extends BaseComponent implements OnInit {

	constructor() {
		super();
	 }

	ngOnInit() { }
}