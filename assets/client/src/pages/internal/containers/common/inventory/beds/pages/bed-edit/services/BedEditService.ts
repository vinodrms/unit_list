import {Injectable} from '@angular/core';
import {FormBuilder, ControlGroup, Validators, AbstractControl, Control} from '@angular/common';
import {BedVM} from '../../../../../../../services/beds/view-models/BedVM';
import {BedDO, BedSizeDO, BedCapacityDO, BedStorageType, BedAccommodationType} from '../../../../../../../services/beds/data-objects/BedDO';
import {ThValidators, ThFieldLengths} from '../../../../../../../../../common/utils/form-utils/ThFormUtils';
import {ThUtils} from '../../../../../../../../../common/utils/ThUtils';

@Injectable()
export class BedEditService {
    private _thUtils: ThUtils;

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

        this._thUtils = new ThUtils();
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
        if (this._thUtils.isUndefinedOrNull(bedDO.capacity)) {
            bedDO.capacity = new BedCapacityDO();
        }
        this._maxAdultsControl.updateValue(bedDO.capacity.maxNoAdults);
        this._maxChildrenControl.updateValue(bedDO.capacity.maxNoChildren);
        if (!bedDO.size) {
            this._widthControl.updateValue(null);
            this._lengthControl.updateValue(null);
        }
        else {
            this._widthControl.updateValue(bedDO.size.widthCm);
            this._lengthControl.updateValue(bedDO.size.lengthCm);
        }
        if (this._thUtils.isUndefinedOrNull(bedDO.storageType)) {
            bedDO.storageType = BedStorageType.Stationary;
        }
        if (this._thUtils.isUndefinedOrNull(bedDO.accommodationType)) {
            bedDO.accommodationType = BedAccommodationType.AdultsAndChildren;
        }

        this._notesControl.updateValue(bedDO.notes);
    }

    public updateBed(bed: BedDO) {
        bed.name = this._bedForm.value["name"];

        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = this._bedForm.value["maxAdults"];
        bedCapacity.maxNoChildren = this._bedForm.value["maxChildren"];
        bed.capacity = bedCapacity;

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

    public removeValidatorsForSizeAndCapacity() {
        this.removeValidatorsFor(this._maxAdultsControl);
        this.resetControl(this._maxAdultsControl, '');

        this.removeValidatorsFor(this._maxChildrenControl);
        this.resetControl(this._maxChildrenControl, '');

        this.removeValidatorsFor(this._lengthControl);
        this.resetControl(this._lengthControl, '');

        this.removeValidatorsFor(this._widthControl);
        this.resetControl(this._widthControl, '');
    }

    public addValidatorsForSizeAndCapacityAndInitValues(bedVM: BedVM) {
        this._maxAdultsControl.validator = Validators.compose([Validators.required, ThValidators.positiveIntegerValidator]);
        this._maxChildrenControl.validator = Validators.compose([Validators.required, ThValidators.positiveIntegerValidator]);
        if (!this._thUtils.isUndefinedOrNull(bedVM.bed.capacity)) {
            this.resetControl(this._maxAdultsControl, bedVM.bed.capacity.maxNoAdults);
            this.resetControl(this._maxChildrenControl, bedVM.bed.capacity.maxNoChildren);
        }

        this._lengthControl.validator = Validators.compose([Validators.required, ThValidators.numberValidator]);
        this._widthControl.validator = Validators.compose([Validators.required, ThValidators.numberValidator]);
        if (!this._thUtils.isUndefinedOrNull(bedVM.bed.size)) {
            this.resetControl(this._lengthControl, bedVM.bed.size.lengthCm);
            this.resetControl(this._widthControl, bedVM.bed.size.widthCm);
        }
    }

    private removeValidatorsFor(control: Control) {
        control.validator = Validators.compose([]);
    }

    private resetControl(control: Control, value: any) {
        control.setErrors(null);
        control.updateValue(value);
    }
}