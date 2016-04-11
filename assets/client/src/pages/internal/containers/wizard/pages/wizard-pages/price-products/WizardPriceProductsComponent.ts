import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {WizardPriceProductsService} from './services/WizardPriceProductsService';
import {WizardService} from '../services/WizardService';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {PriceProductsComponent} from '../../../../common/inventory/price-products/main/PriceProductsComponent';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';

@Component({
	selector: 'wizard-price-products',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/price-products/template/wizard-price-products.html',
	providers: [],
	directives: [PriceProductsComponent],
	pipes: [TranslationPipe]
})

export class WizardPriceProductsComponent extends BaseComponent implements OnInit {
	private _isEditScreen: boolean;
	private _wizardController: IWizardController;

	constructor(wizardService: WizardService,
		private _priceProductsService: WizardPriceProductsService) {
		super();
		wizardService.bootstrapWizardIndex(_priceProductsService.stateIndex);
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