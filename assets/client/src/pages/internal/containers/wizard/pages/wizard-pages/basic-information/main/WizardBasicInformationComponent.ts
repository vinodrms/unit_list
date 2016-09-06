import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {WizardBasicInformationStateService} from './services/WizardBasicInformationStateService';
import {WizardService} from '../../services/WizardService';

@Component({
	selector: 'wizard-basic-information',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/main/template/wizard-basic-information.html'
})
export class WizardBasicInformationComponent extends BaseComponent {
	constructor(wizardService: WizardService, basicInfoStateService: WizardBasicInformationStateService) {
		super();
		wizardService.bootstrapWizardIndex(basicInfoStateService.stateIndex);
	}
}