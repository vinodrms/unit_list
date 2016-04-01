import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {WizardAddOnProductsStateService} from './services/WizardAddOnProductsStateService';
import {WizardService} from '../services/WizardService';

@Component({
	selector: 'wizard-add-on-products',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/add-on-products/template/wizard-add-on-products.html'
})

export class WizardAddOnProductsComponent extends BaseComponent {

	constructor(wizardService: WizardService, addOnProductsStateService: WizardAddOnProductsStateService) {
		super();
		wizardService.bootstrapWizardIndex(addOnProductsStateService.stateIndex);
	}
}