import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {SettingsNavbarService} from '../../navbar/services/SettingsNavbarService';
import {SettingsPageType} from '../../navbar/services/utils/SettingsPageType';
import {SettingsBasicInfoPageVM} from './services/utils/SettingsBasicInfoPageVM';
import {SettingsBasicInformationService} from './services/SettingsBasicInformationService';
import {SettingsBasicInfoOverviewComponent} from '../pages/overview/SettingsBasicInfoOverviewComponent';
import {SettingsBasicInfoPaymentsAndPoliciesComponent} from '../pages/payments-policies/SettingsBasicInfoPaymentsAndPoliciesComponent';
import {SettingsBasicInfoPropertyDetailsComponent} from '../pages/property-details/SettingsBasicInfoPropertyDetailsComponent';
import {TimezoneService} from '../../../../../../../../services/timezones/TimezoneService';

@Component({
	selector: 'settings-basic-information',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/basic-information/main/template/settings-basic-information.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [TimezoneService, SettingsBasicInformationService],
	pipes: [TranslationPipe],
	precompile: [SettingsBasicInfoOverviewComponent, SettingsBasicInfoPaymentsAndPoliciesComponent,
		SettingsBasicInfoPropertyDetailsComponent]
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