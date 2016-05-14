import {Component, Input} from '@angular/core';
import {Control, Validators, ControlGroup, FormBuilder} from '@angular/common';
import {BaseFormComponent} from '../../../../../../../../../../common/base/BaseFormComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {IAllotmentEditSection} from '../utils/IAllotmentEditSection';
import {AllotmentVM} from '../../../../../../../../services/allotments/view-models/AllotmentVM';

@Component({
	selector: 'allotment-notes-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/allotments/pages/allotment-edit/sections/notes/template/allotment-notes-section.html',
	pipes: [TranslationPipe]
})
export class AllotmentNotesSectionComponent extends BaseFormComponent implements IAllotmentEditSection {
	@Input() didSubmit: boolean;
	readonly: boolean;

	private _notesControl: Control;
	private _formGroup: ControlGroup;

	constructor(private _formBuilder: FormBuilder) {
		super();
		this._notesControl = new Control(null, Validators.compose([Validators.maxLength(2000)]));
		this._formGroup = this._formBuilder.group({
			"notes": this._notesControl
		})
	}
	isValid(): boolean {
		return this._notesControl.valid;
	}
	initializeFrom(allotmentVM: AllotmentVM) {
		this._notesControl.updateValue(allotmentVM.allotment.notes);
	}
	updateDataOn(allotmentVM: AllotmentVM) {
		allotmentVM.allotment.notes = this._notesControl.value;
	}

	public getDefaultControlGroup(): ControlGroup {
		return this._formGroup;
	}
	protected get didSubmitForm(): boolean {
		return this.didSubmit;
	}
}