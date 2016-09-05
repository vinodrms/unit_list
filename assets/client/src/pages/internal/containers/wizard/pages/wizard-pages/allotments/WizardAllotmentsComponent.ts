import {Component, OnInit, AfterViewInit, ViewChild, ReflectiveInjector} from '@angular/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {AllotmentsComponent} from '../../../../common/inventory/allotments/main/AllotmentsComponent';
import {WizardStepsComponent} from '../../utils/wizard-steps/WizardStepsComponent';
import {WizardStepsModule} from '../../utils/wizard-steps/WizardStepsModule';
import {WizardAllotmentsStateService} from './services/WizardAllotmentsStateService';
import {WizardService} from '../services/WizardService';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {AllotmentDO, AllotmentStatus} from '../../../../../services/allotments/data-objects/AllotmentDO';
import {AllotmentsTotalCountService} from '../../../../../services/allotments/AllotmentsTotalCountService';
import {TotalCountDO} from '../../../../../services/common/data-objects/lazy-load/TotalCountDO';

@Component({
	selector: 'wizard-allotments',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/allotments/template/wizard-allotments.html',
	providers: [AllotmentsTotalCountService]
})
export class WizardAllotmentsComponent extends BaseComponent implements AfterViewInit {
	@ViewChild(AllotmentsComponent) private _allotmentsComponent: AllotmentsComponent;
	private _isEditScreen: boolean;

	private _wizardController: IWizardController;

	constructor(private _wizardService: WizardService,
		private _allotmentsStateService: WizardAllotmentsStateService,
		private _allotmentsTotalCountService: AllotmentsTotalCountService) {
		super();
		_wizardService.bootstrapWizardIndex(_allotmentsStateService.stateIndex);
		this._wizardController = _wizardService;
		this.isEditScreen = false;
	}

	ngOnInit() {
		this._allotmentsTotalCountService.getTotalCountDO(AllotmentStatus.Active).subscribe((totalCount: TotalCountDO) => {
			this._allotmentsStateService.totalNoOfAllotments = totalCount.numOfItems;
		});
	}

	public ngAfterViewInit() {
		setTimeout(() => {
			this.initializeWizardStepsComponent();
		});
	}
	private initializeWizardStepsComponent() {
		this._allotmentsComponent.bootstrapOverviewBottom(WizardStepsModule, WizardStepsComponent, ReflectiveInjector.resolve([{ provide: WizardService, useValue: this._wizardService }]));
	}
	public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
		switch (screenStateType) {
			case InventoryScreenStateType.Edit:
				this._wizardController.wizardButtonsVisible = false;
				this.isEditScreen = true;
				break;
			default:
				this._wizardController.wizardButtonsVisible = true;
				this._allotmentsTotalCountService.updateTotalCount();
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
	public didDeleteItem(deletedAllotment: AllotmentDO) {
		this._allotmentsTotalCountService.updateTotalCount();
	}
}