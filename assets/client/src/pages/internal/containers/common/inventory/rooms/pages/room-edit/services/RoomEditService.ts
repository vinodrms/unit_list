import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl} from '@angular/forms';
import {RoomVM} from '../../../../../../../services/rooms/view-models/RoomVM';
import {RoomDO} from '../../../../../../../services/rooms/data-objects/RoomDO';
import {ThValidators, ThFieldLengths} from '../../../../../../../../../common/utils/form-utils/ThFormUtils';

@Injectable()
export class RoomEditService {

    private _nameControl: FormControl;
    private _floorControl: FormControl;
    private _notesControl: FormControl;

    private _roomForm: FormGroup;

    constructor(private _formBuilder: FormBuilder) {
        this.initFormControls();
        this.initFormGroup();
    }
    private initFormControls() {
        this._nameControl = new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(200)]));
        this._floorControl = new FormControl(null, Validators.compose([Validators.required, ThValidators.integerValidator]));
        this._notesControl = new FormControl(null, Validators.compose([Validators.maxLength(2000)]));
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
        this._nameControl.setValue(roomDO.name);
        this._floorControl.setValue(roomDO.floor);
        this._notesControl.setValue(roomDO.notes);
    }

    public updateRoom(room: RoomDO) {
        room.name = this._roomForm.value["name"];
        room.floor = this._roomForm.value["floor"];
        room.notes = this._roomForm.value["notes"];
    }

    public isValidForm(): boolean {
        return this._roomForm.valid;
    }

    public get roomForm(): FormGroup {
        return this._roomForm;
    }
    public set roomForm(roomForm: FormGroup) {
        this._roomForm = roomForm;
    }
}