import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../../common/utils/localization/TranslationPipe';
import {BasicInfoPaymentsAndPoliciesEditComponent} from '../../../../../../../../common/basic-info/payments-policies/main/BasicInfoPaymentsAndPoliciesEditComponent';
import {BasicInfoPaymentsAndPoliciesEditService} from '../../../../../../../../common/basic-info/payments-policies/main/services/BasicInfoPaymentsAndPoliciesEditService';
import {SettingsBasicInformationService} from '../../main/services/SettingsBasicInformationService';
import {SettingsBasicInfoPageType} from '../../main/services/utils/SettingsBasicInfoPageType';

@Component({
	selector: 'settings-basic-info-payments-and-policies',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/settings/subcomponents/basic-information/pages/payments-policies/template/settings-basic-info-payments-and-policies.html',
	directives: [BasicInfoPaymentsAndPoliciesEditComponent],
	providers: [BasicInfoPaymentsAndPoliciesEditService],
	pipes: [TranslationPipe]
})
export class SettingsBasicInfoPaymentsAndPoliciesComponent extends BaseComponent {
    constructor(private _basicInfoService: SettingsBasicInformationService,
		private _overviewEditService: BasicInfoPaymentsAndPoliciesEditService) {
		super();
		this._basicInfoService.bootstrap(SettingsBasicInfoPageType.PaymentsAndPolicies);
	}
}