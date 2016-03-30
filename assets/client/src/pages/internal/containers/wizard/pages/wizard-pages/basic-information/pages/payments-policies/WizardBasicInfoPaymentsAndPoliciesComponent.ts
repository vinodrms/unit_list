import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {WizardBasicInfoPaymentsAndPoliciesService} from './services/WizardBasicInfoPaymentsAndPoliciesService';
import {WizardBasicInformationStateService} from '../../main/services/WizardBasicInformationStateService';
import {BasicInfoPaymentsAndPoliciesEditComponent} from '../../../../../../common/basic-info/payments-policies/main/BasicInfoPaymentsAndPoliciesEditComponent';
import {BasicInfoPaymentsAndPoliciesEditService} from '../../../../../../common/basic-info/payments-policies/main/services/BasicInfoPaymentsAndPoliciesEditService';

@Component({
	selector: 'wizard-basic-info-payments-policies',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/pages/payments-policies/template/wizard-basic-info-payments-policies.html',
	directives: [BasicInfoPaymentsAndPoliciesEditComponent],
	providers: [BasicInfoPaymentsAndPoliciesEditService],
	pipes: [TranslationPipe]
})
export class WizardBasicInfoPaymentsAndPoliciesComponent extends BaseComponent implements OnInit {
    constructor(private _overviewEditService: BasicInfoPaymentsAndPoliciesEditService,
		private _overviewService: WizardBasicInfoPaymentsAndPoliciesService, 
        private _basicInfoStateService: WizardBasicInformationStateService) {
		super();

	}
	ngOnInit() {
        this._basicInfoStateService.basicInfoController.bootstrapBasicInfoStepIndex(this._overviewService.stepIndex);
		this._overviewService.bootstrap(this._overviewEditService);
	}
}