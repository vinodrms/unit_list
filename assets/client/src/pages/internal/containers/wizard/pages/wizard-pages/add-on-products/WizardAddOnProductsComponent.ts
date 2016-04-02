import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {WizardAddOnProductsStateService} from './services/WizardAddOnProductsStateService';
import {WizardService} from '../services/WizardService';
import {AddOnProductsComponent} from '../../../../common/inventory/add-on-products/main/AddOnProductsComponent';

@Component({
	selector: 'wizard-add-on-products',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/add-on-products/template/wizard-add-on-products.html',
	directives: [AddOnProductsComponent],
	pipes: [TranslationPipe]
})

export class WizardAddOnProductsComponent extends BaseComponent {

	constructor(wizardService: WizardService, addOnProductsStateService: WizardAddOnProductsStateService) {
		super();
		wizardService.bootstrapWizardIndex(addOnProductsStateService.stateIndex);
	}
}