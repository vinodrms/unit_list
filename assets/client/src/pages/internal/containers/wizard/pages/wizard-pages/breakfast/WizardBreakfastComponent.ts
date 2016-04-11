import {Component, OnInit} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {WizardBreakfastStateService} from './services/WizardBreakfastStateService';
import {WizardService} from '../services/WizardService';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {AddOnProductsComponent} from '../../../../common/inventory/add-on-products/main/AddOnProductsComponent';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {AddOnProductsTotalCountService} from '../../../../../services/add-on-products/AddOnProductsTotalCountService';
import {TotalCountDO} from '../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {AddOnProductCategoriesService} from '../../../../../services/settings/AddOnProductCategoriesService';
import {AddOnProductCategoriesDO} from '../../../../../services/settings/data-objects/AddOnProductCategoriesDO';
import {AddOnProductCategoryDO} from '../../../../../services/common/data-objects/add-on-product/AddOnProductCategoryDO';

@Component({
	selector: 'wizard-breakfast',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/breakfast/template/wizard-breakfast.html',
	providers: [AddOnProductsTotalCountService],
	directives: [AddOnProductsComponent],
	pipes: [TranslationPipe]
})

export class WizardBreakfastComponent extends BaseComponent implements OnInit {
	private _isEditScreen: boolean;


	private _wizardController: IWizardController;

	constructor(wizardService: WizardService,
		private _breakfastStateService: WizardBreakfastStateService,
		private _addOnProductCategoriesService: AddOnProductCategoriesService,
		private _addOnProductsTotalCountService: AddOnProductsTotalCountService) {
		super();
		wizardService.bootstrapWizardIndex(_breakfastStateService.stateIndex);
		this._wizardController = wizardService;
		this.isEditScreen = false;
	}

	public ngOnInit() {
		this._addOnProductCategoriesService.getAddOnProductCategoriesDO().flatMap((addOnProductCategoriesDO: AddOnProductCategoriesDO) => {
			var breakfastCategory: AddOnProductCategoryDO = addOnProductCategoriesDO.getBreakfastCategory();
			return this._addOnProductsTotalCountService.getTotalCountDO(breakfastCategory);
		}).subscribe((totalCount: TotalCountDO) => {
			this._breakfastStateService.totalNoOfBreakfasts = totalCount.numOfItems;
		});
	}

	public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
		switch (screenStateType) {
			case InventoryScreenStateType.Edit:
				this._wizardController.wizardButtonsVisible = false;
				this.isEditScreen = true;
				break;
			default:
				this._addOnProductsTotalCountService.updateTotalCount();
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