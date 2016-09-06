import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {WizardBasicInfoIntroService} from './services/WizardBasicInfoIntroService';
import {WizardBasicInformationStateService} from '../../main/services/WizardBasicInformationStateService';

@Component({
	selector: 'wizard-basic-info-intro',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/pages/intro/template/wizard-basic-info-intro.html'
})
export class WizardBasicInfoIntroComponent extends BaseComponent {
	constructor(private _introService: WizardBasicInfoIntroService,
		private _basicInfoStateService: WizardBasicInformationStateService) {
		super();
	}
	ngOnInit() {
		this._basicInfoStateService.basicInfoController.bootstrapBasicInfoStepIndex(this._introService.stepIndex);
	}
}