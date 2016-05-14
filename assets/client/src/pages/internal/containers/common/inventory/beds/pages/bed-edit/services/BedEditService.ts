import {Injectable} from '@angular/core';
import {FormBuilder, ControlGroup, Validators, AbstractControl, Control} from '@angular/common';
import {BedVM} from '../../../../../../../services/beds/view-models/BedVM';
import {BedDO, BedSizeDO} from '../../../../../../../services/beds/data-objects/BedDO';
import {ThValidators, ThFieldLengths} from '../../../../../../../../../common/utils/form-utils/ThFormUtils';

@Injectable()
export class BedEditService {

    private _nameControl: Control;
    private _maxAdultsControl: Control;
    private _maxChildrenControl: Control;
    private _widthControl: Control;
    private _lengthControl: Control;
    private _notesControl: Control;

    private _bedForm: ControlGroup;

    constructor(private _formBuilder: FormBuilder) {
        this.initFormControls();
        this.initFormGroup();
    }
    private initFormControls() {
        this._nameControl = new Control(null, Validators.compose([Validators.required, Validators.maxLength(200)]));
        this._maxAdultsControl = new Control(null, Validators.compose([Validators.required, ThValidators.positiveIntegerValidator]));
        this._maxChildrenControl = new Control(null, Validators.compose([Validators.required, ThValidators.positiveIntegerValidator]));
        this._widthControl = new Control(null, Validators.compose([Validators.required, ThValidators.numberValidator]));
        this._lengthControl = new Control(null, Validators.compose([Validators.required, ThValidators.numberValidator]));
        this._notesControl = new Control(null, Validators.compose([Validators.maxLength(2000)]));
    }
    private initFormGroup() {
        this._bedForm = this._formBuilder.group({
            "name": this._nameControl,
            "maxAdults": this._maxAdultsControl,
            "maxChildren": this._maxChildrenControl,
            "width": this._widthControl,
            "length": this._lengthControl,
            "notes": this._notesControl
        });
    }

    public updateFormValues(bedVM: BedVM) {
        var bedDO = bedVM.bed;
        this._nameControl.updateValue(bedDO.name);
        this._maxAdultsControl.updateValue(bedDO.maxNoAdults);
        this._maxChildrenControl.updateValue(bedDO.maxNoChildren);
        if (!bedDO.size) {
            this._widthControl.updateValue(null);
            this._lengthControl.updateValue(null);
        }
        else {
            this._widthControl.updateValue(bedDO.size.widthCm);
            this._lengthControl.updateValue(bedDO.size.lengthCm);
        }
        this._notesControl.updateValue(bedDO.notes);
    }

    public updateBed(bed: BedDO) {
        bed.name = this._bedForm.value["name"];
        bed.maxNoAdults = this._bedForm.value["maxAdults"];
        bed.maxNoChildren = this._bedForm.value["maxChildren"];
        var bedSizeDO = new BedSizeDO();
        bedSizeDO.widthCm = this._bedForm.value["width"];
        bedSizeDO.lengthCm = this._bedForm.value["length"];
        bed.size = bedSizeDO;
        bed.notes = this._bedForm.value["notes"]
    }

    public isValidForm(): boolean {
        return this._bedForm.valid;
    }

    public get bedForm(): ControlGroup {
        return this._bedForm;
    }
    public set bedForm(bedForm: ControlGroup) {
        this._bedForm = bedForm;
    }
}