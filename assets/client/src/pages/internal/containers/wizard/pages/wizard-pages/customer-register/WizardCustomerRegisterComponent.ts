import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {WizardCustomerRegisterStateService} from './services/WizardCustomerRegisterStateService';
import {WizardService} from '../services/WizardService';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {CustomerRegisterComponent} from '../../../../common/inventory/customer-register/main/CustomerRegisterComponent';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';

@Component({
	selector: 'wizard-customer-register',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/customer-register/template/wizard-customer-register.html',
	providers: [],
	directives: [CustomerRegisterComponent],
	pipes: [TranslationPipe]
})

export class WizardCustomerRegisterComponent extends BaseComponent implements OnInit {
	private _isEditScreen: boolean;


	private _wizardController: IWizardController;

	constructor(wizardService: WizardService,
		private _customerRegisterStateService: WizardCustomerRegisterStateService) {
		super();
		wizardService.bootstrapWizardIndex(_customerRegisterStateService.stateIndex);
		this._wizardController = wizardService;
		this.isEditScreen = false;
	}

	public ngOnInit() {
		
	}

	public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
		switch (screenStateType) {
			case InventoryScreenStateType.Edit:
				this._wizardController.wizardButtonsVisible = false;
				this.isEditScreen = true;
				break;
			default:
				this._wizardController.wizardButtonsVisible = true;
				this.isEditScreen = false;
				break;
		}
	}

	public get isEditScreen(): boolean {
		return this._isEditScreen;
	}
	public set isEditScreen(isEditScreen: boolean) {
		this._isEditScreen = isEditScreen;
	}
}