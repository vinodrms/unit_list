import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {WizardAddOnProductsStateService} from './services/WizardAddOnProductsStateService';
import {WizardService} from '../services/WizardService';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {AddOnProductsComponent} from '../../../../common/inventory/add-on-products/main/AddOnProductsComponent';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';

@Component({
	selector: 'wizard-add-on-products',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/add-on-products/template/wizard-add-on-products.html',
	directives: [AddOnProductsComponent],
	pipes: [TranslationPipe]
})

export class WizardAddOnProductsComponent extends BaseComponent {
	private _wizardController: IWizardController;

	constructor(wizardService: WizardService, addOnProductsStateService: WizardAddOnProductsStateService) {
		super();
		wizardService.bootstrapWizardIndex(addOnProductsStateService.stateIndex);
		this._wizardController = wizardService;
	}

	public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
		switch (screenStateType) {
			case InventoryScreenStateType.Edit:
				this._wizardController.wizardButtonsVisible = false;
				break;
			default:
				this._wizardController.wizardButtonsVisible = true;
				break;
		}
	}
}