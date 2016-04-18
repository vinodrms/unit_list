import {Component} from 'angular2/core';
import {BaseComponent} from '../../../../../../../common/base/BaseComponent';
import {WizardRoomsStateService} from './services/WizardRoomsStateService';
import {TranslationPipe} from '../../../../../../../common/utils/localization/TranslationPipe';
import {IWizardController} from '../../wizard-pages/services/IWizardController';
import {WizardService} from '../services/WizardService';
import {InventoryScreenStateType} from '../../../../common/inventory/utils/state-manager/InventoryScreenStateType';
import {RoomsTotalCountService} from '../../../../../services/rooms/RoomsTotalCountService';
import {RoomDO} from '../../../../../services/rooms/data-objects/RoomDO';
import {TotalCountDO} from '../../../../../services/common/data-objects/lazy-load/TotalCountDO';
import {RoomsComponent} from '../../../../common/inventory/rooms/main/RoomsComponent';

@Component({
    selector: 'wizard-rooms',
    templateUrl: '/client/src/pages/internal/containers/wizard/pages/wizard-pages/rooms/template/wizard-rooms.html',
    providers: [RoomsTotalCountService],
    directives: [RoomsComponent],
    pipes: [TranslationPipe]
})
export class WizardRoomsComponent extends BaseComponent {
    private _wizardController: IWizardController;

    constructor(wizardService: WizardService, private _roomsStateService: WizardRoomsStateService, 
        private _roomsTotalCountService: RoomsTotalCountService) {
        super();
        wizardService.bootstrapWizardIndex(_roomsStateService.stateIndex);
        this._wizardController = wizardService;
    }

    ngOnInit() { 
        this._roomsTotalCountService.getTotalCountDO().subscribe((totalCount: TotalCountDO) => {
			this._roomsStateService.totalNoOfRooms = totalCount.numOfItems;
		});
    }

    public didChangeScreenStateType(screenStateType: InventoryScreenStateType) {
        switch (screenStateType) {
            case InventoryScreenStateType.Edit:
                this._wizardController.wizardButtonsVisible = false;
                break;
            default:
                this._roomsTotalCountService.updateTotalCount();
                this._wizardController.wizardButtonsVisible = true;
                break;
        }
    }
    
    public didDeleteItem(deletedRoom: RoomDO) {
		this._roomsTotalCountService.updateTotalCount();
	}
}