import {Component, ViewChild, OnInit, AfterViewInit, ReflectiveInjector} from '@angular/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {WizardPriceProductsStateService} from './services/WizardPriceProductsStateService';
import {WizardService} from '../services/WizardService';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {PriceProductsComponent} from '../../../../common/inventory/price-products/main/PriceProductsComponent';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {PriceProductsTotalCountService} from '../../../../../services/price-products/PriceProductsTotalCountService';
import {PriceProductStatus, PriceProductDO} from '../../../../../services/price-products/data-objects/PriceProductDO';
import {TotalCountDO} from '../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {WizardStepsComponent} from '../../utils/wizard-steps/WizardStepsComponent';
import {WizardStepsModule} from '../../utils/wizard-steps/WizardStepsModule';

@Component({
	selector: 'wizard-price-products',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/price-products/template/wizard-price-products.html',
	providers: [PriceProductsTotalCountService]
})
export class WizardPriceProductsComponent extends BaseComponent implements OnInit, AfterViewInit {
	@ViewChild(PriceProductsComponent) private _priceProductsComponent: PriceProductsComponent;
	private _isEditScreen: boolean;
	private _wizardController: IWizardController;

	constructor(private _wizardService: WizardService,
		private _priceProductsStateService: WizardPriceProductsStateService,
		private _priceProductsTotalCountService: PriceProductsTotalCountService) {
		super();
		_wizardService.bootstrapWizardIndex(_priceProductsStateService.stateIndex);
		this._wizardController = _wizardService;
		this.isEditScreen = false;
	}

	public ngOnInit() {
		this._priceProductsTotalCountService.getTotalCountDO(PriceProductStatus.Active).subscribe((totalCount: TotalCountDO) => {
			this._priceProductsStateService.totalNoOfActivePriceProducts = totalCount.numOfItems;
		});
	}
    public ngAfterViewInit() {
		setTimeout(() => {
			this.initializeWizardStepsComponent();
		});
	}
	private initializeWizardStepsComponent() {
		this._priceProductsComponent.bootstrapOverviewBottom(WizardStepsModule, WizardStepsComponent, ReflectiveInjector.resolve([{ provide: WizardService, useValue: this._wizardService }]));
	}

	public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
		switch (screenStateType) {
			case InventoryScreenStateType.Edit:
				this._wizardController.wizardButtonsVisible = false;
				this.isEditScreen = true;
				break;
			default:
				this._wizardController.wizardButtonsVisible = true;
				this._priceProductsTotalCountService.updateTotalCount();
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

	public didDeleteItem(deletedPriceProduct: PriceProductDO) {
		this._priceProductsTotalCountService.updateTotalCount();
	}
}