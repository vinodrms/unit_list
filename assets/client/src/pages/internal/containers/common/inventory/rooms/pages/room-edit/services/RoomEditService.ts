import {Injectable} from '@angular/core';
import {FormBuilder, ControlGroup, Validators, AbstractControl, Control} from '@angular/common';
import {RoomVM} from '../../../../../../../services/rooms/view-models/RoomVM';
import {RoomDO} from '../../../../../../../services/rooms/data-objects/RoomDO';
import {ThValidators, ThFieldLengths} from '../../../../../../../../../common/utils/form-utils/ThFormUtils';

@Injectable()
export class RoomEditService {

    private _nameControl: Control;
    private _floorControl: Control;
    private _notesControl: Control;
    
    private _roomForm: ControlGroup;

    constructor(private _formBuilder: FormBuilder) {
        this.initFormControls();
        this.initFormGroup();
    }
    private initFormControls() {
        this._nameControl = new Control(null, Validators.compose([Validators.required, Validators.maxLength(200)]));
        this._floorControl = new Control(null, Validators.compose([Validators.required, ThValidators.numberValidator]));
        this._notesControl = new Control(null, Validators.compose([Validators.maxLength(2000)]));
    }
    private initFormGroup() {
        this._roomForm = this._formBuilder.group({
            "name": this._nameControl,
            "floor": this._floorControl,
            "notes": this._notesControl
        });
    }

    public updateFormValues(roomVM: RoomVM) {
        var roomDO = roomVM.room;
        this._nameControl.updateValue(roomDO.name);
        this._floorControl.updateValue(roomDO.floor);
        this._notesControl.updateValue(roomDO.notes);
    }

    public updateRoom(room: RoomDO) {
        room.name = this._roomForm.value["name"];
        room.floor = this._roomForm.value["floor"];
        room.notes = this._roomForm.value["notes"];
    }

    public isValidForm(): boolean {
        return this._roomForm.valid;
    }

    public get roomForm(): ControlGroup {
        return this._roomForm;
    }
    public set roomForm(roomForm: ControlGroup) {
        this._roomForm = roomForm;
    }
}