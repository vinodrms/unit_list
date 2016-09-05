import {Component, Input} from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {BaseFormComponent} from '../../../../../../../../../../common/base/BaseFormComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';

@Component({
	selector: 'price-product-edit-notes-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/notes/template/price-product-edit-notes-section.html'
})
export class PriceProductEditNotesSectionComponent extends BaseFormComponent implements IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	private _notesControl: FormControl;
	private _formGroup: FormGroup;

	constructor(private _formBuilder: FormBuilder) {
		super();
		this._notesControl = new FormControl(null, Validators.compose([Validators.maxLength(2000)]));
		this._formGroup = this._formBuilder.group({
			"notes": this._notesControl
		})
	}
	public isValid(): boolean {
		return this._notesControl.valid;
	}
	public initializeFrom(priceProductVM: PriceProductVM) {
		this._notesControl.setValue(priceProductVM.priceProduct.notes);
	}
	public updateDataOn(priceProductVM: PriceProductVM) {
		priceProductVM.priceProduct.notes = this._notesControl.value;
	}

	public getDefaultFormGroup(): FormGroup {
		return this._formGroup;
	}
	protected get didSubmitForm(): boolean {
		return this.didSubmit;
	}
}