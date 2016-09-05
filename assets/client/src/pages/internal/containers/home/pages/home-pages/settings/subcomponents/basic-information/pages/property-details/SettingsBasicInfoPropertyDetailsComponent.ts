import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {BasicInfoPropertyDetailsEditService} from '../../../../../../../../common/basic-info/property-details/main/services/BasicInfoPropertyDetailsEditService';
import {SettingsBasicInformationService} from '../../main/services/SettingsBasicInformationService';
import {SettingsBasicInfoPageType} from '../../main/services/utils/SettingsBasicInfoPageType';

@Component({
	selector: 'settings-basic-info-property-details',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/basic-information/pages/property-details/template/settings-basic-info-property-details.html',
	providers: [BasicInfoPropertyDetailsEditService]
})
export class SettingsBasicInfoPropertyDetailsComponent extends BaseComponent {
    constructor(private _basicInfoService: SettingsBasicInformationService,
		private _overviewEditService: BasicInfoPropertyDetailsEditService) {
		super();
		this._basicInfoService.bootstrap(SettingsBasicInfoPageType.PropertyDetails);
	}
}