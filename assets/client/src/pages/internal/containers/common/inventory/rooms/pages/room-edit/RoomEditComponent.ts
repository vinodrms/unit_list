import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {ControlGroup} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {LoadingComponent} from '../../../../../../../../common/utils/components/LoadingComponent';
import {BaseFormComponent} from '../../../../../../../../common/base/BaseFormComponent';
import {AppContext, ThError} from '../../../../../../../../common/utils/AppContext';
import {RoomVM} from '../../../../../../services/rooms/view-models/RoomVM';
import {RoomDO} from '../../../../../../services/rooms/data-objects/RoomDO';
import {RoomsService} from '../../../../../../services/rooms/RoomsService';
import {RoomEditService} from './services/RoomEditService';
import {RoomAmenitiesService} from '../../../../../../services/settings/RoomAmenitiesService';
import {RoomAttributesService} from '../../../../../../services/settings/RoomAttributesService';
import {RoomCategoriesService} from '../../../../../../services/room-categories/RoomCategoriesService';

@Component({
    selector: 'room-edit',
    templateUrl: '/client/src/pages/internal/containers/common/inventory/rooms/pages/room-edit/template/room-edit.html',
    providers: [RoomEditService],
    directives: [LoadingComponent],
    pipes: [TranslationPipe]
})
export class RoomEditComponent extends BaseFormComponent implements OnInit  {
    isLoading: boolean;
    isSavingRoom: boolean = false;
    
    private _roomVM: RoomVM;
    public get roomVM(): RoomVM {
		return this._roomVM;
	}
	@Input()
	public set roomVM(roomVM: RoomVM) {
		this._roomVM = roomVM;
		this.initDefaultBedData();
		this.initForm();
	}
    @Output() onExit = new EventEmitter();
	public showViewScreen() {
		this.onExit.next(true);
	}
    
    constructor(private _appContext: AppContext,
        private _roomEditService: RoomEditService,
        private _roomsService: RoomsService,
        private _roomAmenitiesService: RoomAmenitiesService,
        private _roomAttributesService: RoomAttributesService,
        private _roomCategoriesService: RoomCategoriesService) {
        super();
    }

    ngOnInit() { }
    
    private initDefaultBedData() {
		
	}
	private initForm() {
		this.didSubmitForm = false;
        this._roomEditService.updateFormValues(this._roomVM);	
	}
    
    protected getDefaultControlGroup(): ControlGroup {
        return this._roomEditService.roomForm;
    }
    
    public isNewRoom(): boolean {
		return this._roomVM.room.id == null || this._roomVM.room.id.length == 0;
	}
    
    public saveRoom() {
        this.didSubmitForm = true;
        if (!this._roomEditService.isValidForm()) {
			var errorMessage = this._appContext.thTranslation.translate("Please complete all the required fields");
			this._appContext.toaster.error(errorMessage);
			return;
		}    
        var room = this._roomVM.room;
        this._roomEditService.updateRoom(room);
        
        this.isSavingRoom = true;
		this._roomsService.saveRoomDO(room).subscribe((updatedRoom: RoomDO) => {
			this.isSavingRoom = false;
			this.showViewScreen();
		}, (error: ThError) => {
			this.isSavingRoom = false;
			this._appContext.toaster.error(error.message);
		});
    }
}