import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {WizardAddOnProductsStateService} from './services/WizardAddOnProductsStateService';
import {WizardService} from '../services/WizardService';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {AddOnProductsComponent} from '../../../../common/inventory/add-on-products/main/AddOnProductsComponent';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {AddOnProductsTotalCountService} from '../../../../../services/add-on-products/AddOnProductsTotalCountService';
import {TotalCountDO} from '../../../../../services/common/data-objects/lazy-load/TotalCountDO';

@Component({
	selector: 'wizard-add-on-products',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/add-on-products/template/wizard-add-on-products.html',
	providers: [AddOnProductsTotalCountService],
	directives: [AddOnProductsComponent],
	pipes: [TranslationPipe]
})

export class WizardAddOnProductsComponent extends BaseComponent implements OnInit {
	private _wizardController: IWizardController;

	constructor(wizardService: WizardService, 
		private _addOnProductsStateService: WizardAddOnProductsStateService,
		private _addOnProductsTotalCountService: AddOnProductsTotalCountService) {
		super();
		wizardService.bootstrapWizardIndex(_addOnProductsStateService.stateIndex);
		this._wizardController = wizardService;
	}
	
	public ngOnInit() {
		this._addOnProductsTotalCountService.getTotalCountDO().subscribe((totalCount: TotalCountDO) => {
			this._addOnProductsStateService.totalNoOfAddOnProducts = totalCount.numOfItems;
		});
	}

	public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
		switch (screenStateType) {
			case InventoryScreenStateType.Edit:
				this._wizardController.wizardButtonsVisible = false;
				break;
			default:
				this._addOnProductsTotalCountService.updateTotalCount();
				this._wizardController.wizardButtonsVisible = true;
				break;
		}
	}
}