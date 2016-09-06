import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {SettingsNavbarService} from '../../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../../navbar/services/utils/SettingsPageType';
import {SettingsBasicInfoPageVM} from './services/utils/SettingsBasicInfoPageVM';
import {SettingsBasicInformationService} from './services/SettingsBasicInformationService';

@Component({
	selector: 'settings-basic-information',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/basic-information/main/template/settings-basic-information.html',
	providers: [SettingsBasicInformationService]
})
export class SettingsBasicInformationComponent extends BaseComponent {

	constructor(private _navbarService: SettingsNavbarService,
		private _basicInfoService: SettingsBasicInformationService) {
		super();
		this._navbarService.bootstrap(SettingsPageType.BasicInformation);
	}

	public get basicInfoPageList(): SettingsBasicInfoPageVM[] {
		return this._basicInfoService.basicInfoPageList;
	}
	public changePage(basicInfoPage: SettingsBasicInfoPageVM) {
		this._basicInfoService.changePage(basicInfoPage);
	}
}