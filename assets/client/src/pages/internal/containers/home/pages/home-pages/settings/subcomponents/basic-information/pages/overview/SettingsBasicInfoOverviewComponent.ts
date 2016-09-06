import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {BasicInfoOverviewEditService} from '../../../../../../../../common/basic-info/overview/main/services/BasicInfoOverviewEditService';
import {SettingsBasicInformationService} from '../../main/services/SettingsBasicInformationService';
import {SettingsBasicInfoPageType} from '../../main/services/utils/SettingsBasicInfoPageType';

@Component({
	selector: 'settings-basic-info-overview',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/basic-information/pages/overview/template/settings-basic-info-overview.html',
	providers: [BasicInfoOverviewEditService]
})
export class SettingsBasicInfoOverviewComponent extends BaseComponent {
	constructor(private _basicInfoService: SettingsBasicInformationService,
		private _overviewEditService: BasicInfoOverviewEditService) {
		super();
		this._basicInfoService.bootstrap(SettingsBasicInfoPageType.Overview);
	}
}