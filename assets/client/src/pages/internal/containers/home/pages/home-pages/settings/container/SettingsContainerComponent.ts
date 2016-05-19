import {Component, OnInit} from '@angular/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {SettingsNavbarComponent} from '../subcomponents/navbar/SettingsNavbarComponent';
import {SettingsNavbarService} from '../subcomponents/navbar/services/SettingsNavbarService';
import {SettingsBasicInformationComponent} from '../subcomponents/basic-information/main/SettingsBasicInformationComponent';
import {SettingsBedsComponent} from '../subcomponents/beds/SettingsBedsComponent';
import {SettingsRoomsComponent} from '../subcomponents/rooms/SettingsRoomsComponent';
import {SettingsAddOnProductsComponent} from '../subcomponents/add-on-products/SettingsAddOnProductsComponent';
import {SettingsPriceProductsComponent} from '../subcomponents/price-products/SettingsPriceProductsComponent';
import {SettingsCustomerRegisterComponent} from '../subcomponents/customer-register/SettingsCustomerRegisterComponent';
import {SettingsAllotmentsComponent} from '../subcomponents/allotments/SettingsAllotmentsComponent';
import {HeaderPageService} from '../../../utils/header/services/HeaderPageService';
import {HeaderPageType} from '../../../utils/header/services/HeaderPageType';
import {AHomeContainerComponent} from '../../../utils/AHomeContainerComponent';

@RouteConfig([
	{ path: '/basic-info/...', name: 'SettingsBasicInformationComponent', component: SettingsBasicInformationComponent, useAsDefault: true },
	{ path: '/beds', name: 'SettingsBedsComponent', component: SettingsBedsComponent },
    { path: '/rooms', name: 'SettingsRoomsComponent', component: SettingsRoomsComponent },
	{ path: '/add-on-products', name: 'SettingsAddOnProductsComponent', component: SettingsAddOnProductsComponent },
	{ path: '/price-products', name: 'SettingsPriceProductsComponent', component: SettingsPriceProductsComponent },
	{ path: '/customer-register', name: 'SettingsCustomerRegisterComponent', component: SettingsCustomerRegisterComponent },
	{ path: '/allotments', name: 'SettingsAllotmentsComponent', component: SettingsAllotmentsComponent }
])
@Component({
	selector: 'settings-container',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/container/template/settings-container.html',
	directives: [ROUTER_DIRECTIVES, SettingsNavbarComponent],
	providers: [SettingsNavbarService],
	pipes: [TranslationPipe]
})
export class SettingsContainerComponent extends AHomeContainerComponent implements OnInit {

	constructor(private _navbarService: SettingsNavbarService,
		headerPageService: HeaderPageService) {
		super(headerPageService, HeaderPageType.None);
	}

	ngOnInit() {
	}

	public get pageName(): string {
		return this._navbarService.getSelectedPage().pageName;
	}
	public get iconFontName(): string {
		return this._navbarService.getSelectedPage().iconFontName;
	}
	public get numberOfItemsString(): string {
		var numberOfItems = this._navbarService.numberOfItems;
		if (numberOfItems < 0) {
			return "";
		}
		return numberOfItems + "";
	}
}