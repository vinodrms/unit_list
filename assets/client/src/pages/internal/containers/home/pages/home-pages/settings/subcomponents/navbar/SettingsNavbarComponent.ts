import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {SettingsNavbarService} from './services/SettingsNavbarService';
import {SettingsPageVM} from './services/utils/SettingsPageVM';

@Component({
	selector: 'settings-navbar',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/navbar/template/settings-navbar.html',
	pipes: [TranslationPipe]
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