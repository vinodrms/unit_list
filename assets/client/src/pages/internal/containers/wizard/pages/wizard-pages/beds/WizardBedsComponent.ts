import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {WizardBedsStateService} from './services/WizardBedsStateService';
import {WizardService} from '../services/WizardService';
import {BedsTotalCountService} from '../../../../../services/beds/BedsTotalCountService';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {BedsComponent} from '../../../../common/inventory/beds/main/BedsComponent';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {TotalCountDO} from '../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';

@Component({
	selector: 'wizard-beds-component',
	templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/beds/template/wizard-beds-component.html',
    providers: [BedsTotalCountService],
    directives: [BedsComponent],
	pipes: [TranslationPipe]
})

export class WizardBedsComponent extends BaseComponent {
    private _wizardController: IWizardController;
    
	constructor(wizardService: WizardService, private _bedsStateService: WizardBedsStateService,
        private _bedsTotalCountService: BedsTotalCountService) {
		super();
		wizardService.bootstrapWizardIndex(_bedsStateService.stateIndex);
        this._wizardController = wizardService;
	}
    
    public ngOnInit() {
        debugger
		this._bedsTotalCountService.getTotalCountDO().subscribe((totalCount: TotalCountDO) => {
			this._bedsStateService.totalNoOfBeds = totalCount.numOfItems;
		});
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
}