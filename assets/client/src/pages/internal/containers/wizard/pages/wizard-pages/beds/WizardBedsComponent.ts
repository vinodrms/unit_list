import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {WizardBedsStateService} from './services/WizardBedsStateService';
import {WizardService} from '../services/WizardService';

@Component({
	selector: 'wizard-beds-component',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/beds/template/wizard-beds-component.html'
})

export class WizardBedsComponent extends BaseComponent {

	constructor(wizardService: WizardService, bedsStateService: WizardBedsStateService) {
		super();
		wizardService.bootstrapWizardIndex(bedsStateService.stateIndex);
	}
}