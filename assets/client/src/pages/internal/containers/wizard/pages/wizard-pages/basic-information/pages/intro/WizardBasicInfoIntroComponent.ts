import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../common/utils/localization/TranslationPipe';
import {WizardBasicInfoIntroService} from './services/WizardBasicInfoIntroService';
import {WizardBasicInformationStateService} from '../../main/services/WizardBasicInformationStateService';

@Component({
	selector: 'wizard-basic-info-intro',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/basic-information/pages/intro/template/wizard-basic-info-intro.html',
	pipes: [TranslationPipe]
})
export class WizardBasicInfoIntroComponent extends BaseComponent {
	constructor(introService: WizardBasicInfoIntroService, basicInfoStateService: WizardBasicInformationStateService) {
		super();
		basicInfoStateService.basicInfoController.bootstrapBasicInfoStepIndex(introService.stepIndex);
	}
}