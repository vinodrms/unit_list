import {Component, ViewChild, OnInit, AfterViewInit, ReflectiveInjector} from '@angular/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {WizardAddOnProductsStateService} from './services/WizardAddOnProductsStateService';
import {WizardService} from '../services/WizardService';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {AddOnProductsComponent} from '../../../../common/inventory/add-on-products/main/AddOnProductsComponent';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {AddOnProductsTotalCountService} from '../../../../../services/add-on-products/AddOnProductsTotalCountService';
import {AddOnProductDO} from '../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {TotalCountDO} from '../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {WizardStepsComponent} from '../../utils/wizard-steps/WizardStepsComponent';
import {WizardStepsModule} from '../../utils/wizard-steps/WizardStepsModule';

@Component({
	selector: 'wizard-add-on-products',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/add-on-products/template/wizard-add-on-products.html',
	providers: [AddOnProductsTotalCountService]
})
export class WizardAddOnProductsComponent extends BaseComponent implements OnInit, AfterViewInit {
	@ViewChild(AddOnProductsComponent) private _addOnProductsComponent: AddOnProductsComponent;
	private _isEditScreen: boolean;

	private _wizardController: IWizardController;

	constructor(private _wizardService: WizardService,
		private _addOnProductsStateService: WizardAddOnProductsStateService,
		private _addOnProductsTotalCountService: AddOnProductsTotalCountService) {
		super();
		_wizardService.bootstrapWizardIndex(_addOnProductsStateService.stateIndex);
		this._wizardController = _wizardService;
		this.isEditScreen = false;
	}

	public ngOnInit() {
		this._addOnProductsTotalCountService.getTotalCountDO({ filterBreakfastCategory: false }).subscribe((totalCount: TotalCountDO) => {
			this._addOnProductsStateService.totalNoOfAddOnProducts = totalCount.numOfItems;
		});
	}
    public ngAfterViewInit() {
		setTimeout(() => {
			this.initializeWizardStepsComponent();
		});
	}
	private initializeWizardStepsComponent() {
		this._addOnProductsComponent.bootstrapOverviewBottom(WizardStepsModule, WizardStepsComponent, ReflectiveInjector.resolve([{ provide: WizardService, useValue: this._wizardService }]));
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

	public didDeleteItem(deletedAddOnProduct: AddOnProductDO) {
		this._addOnProductsTotalCountService.updateTotalCount();
	}
}