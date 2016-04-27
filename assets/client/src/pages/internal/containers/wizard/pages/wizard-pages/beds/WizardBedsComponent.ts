import {Component, ViewChild, OnInit, AfterViewInit, ReflectiveInjector, provide} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {WizardBedsStateService} from './services/WizardBedsStateService';
import {WizardService} from '../services/WizardService';
import {BedsTotalCountService} from '../../../../../services/beds/BedsTotalCountService';
import {BedDO} from '../../../../../services/beds/data-objects/BedDO';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {BedsComponent} from '../../../../common/inventory/beds/main/BedsComponent';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {TotalCountDO} from '../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {WizardStepsComponent} from '../../utils/wizard-steps/WizardStepsComponent';

@Component({
	selector: 'wizard-beds',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/beds/template/wizard-beds.html',
    providers: [BedsTotalCountService],
    directives: [BedsComponent],
	pipes: [TranslationPipe]
})

export class WizardBedsComponent extends BaseComponent implements OnInit, AfterViewInit {
	@ViewChild(BedsComponent) private _bedsComponent: BedsComponent;
    private _wizardController: IWizardController;

	constructor(private _wizardService: WizardService, private _bedsStateService: WizardBedsStateService,
        private _bedsTotalCountService: BedsTotalCountService) {
		super();
		_wizardService.bootstrapWizardIndex(_bedsStateService.stateIndex);
        this._wizardController = _wizardService;
	}

    public ngOnInit() {
		this._bedsTotalCountService.getTotalCountDO().subscribe((totalCount: TotalCountDO) => {
			this._bedsStateService.totalNoOfBeds = totalCount.numOfItems;
		});
	}
	public ngAfterViewInit() {
		setTimeout(() => {
			this.initializeWizardStepsComponent();
		});
	}
	private initializeWizardStepsComponent() {
		this._bedsComponent.bootstrapOverviewBottom(WizardStepsComponent, ReflectiveInjector.resolve([provide(WizardService, { useValue: this._wizardService })]))
	}

    public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
		switch (screenStateType) {
			case InventoryScreenStateType.Edit:
				this._wizardController.wizardButtonsVisible = false;
				break;
			default:
				this._bedsTotalCountService.updateTotalCount();
				this._wizardController.wizardButtonsVisible = true;
				break;
		}
	}

	public didDeleteItem(deletedBed: BedDO) {
		this._bedsTotalCountService.updateTotalCount();
	}
}