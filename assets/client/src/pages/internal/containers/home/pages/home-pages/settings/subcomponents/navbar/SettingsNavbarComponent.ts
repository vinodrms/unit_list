import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {SettingsNavbarService} from './services/SettingsNavbarService';
import {SettingsPageVM} from './services/utils/SettingsPageVM';

@Component({
	selector: 'settings-navbar',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/navbar/template/settings-navbar.html'
})
export class SettingsNavbarComponent extends BaseComponent {

	constructor(private _navbarService: SettingsNavbarService) {
		super();
	}

	public get settingsPageList(): SettingsPageVM[] {
		return this._navbarService.settingsPageList;
	}
	public changePage(page: SettingsPageVM) {
		this._navbarService.changePage(page);
	}
}