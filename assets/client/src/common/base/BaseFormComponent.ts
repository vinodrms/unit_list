import {FormGroup, AbstractControl} from '@angular/forms';
import {BaseComponent} from './BaseComponent';

export abstract class BaseFormComponent extends BaseComponent {
	private _didSubmitForm: boolean = false;

	protected set didSubmitForm(didSubmitForm: boolean) {
		this._didSubmitForm = didSubmitForm;
	}
	protected get didSubmitForm(): boolean {
		return this._didSubmitForm;
	}

	protected abstract getDefaultFormGroup(): FormGroup;

	public controlIsInvalid(controlName: string, formGroup?: FormGroup): boolean {
		let control: AbstractControl = this.getAbstractControl(controlName, formGroup);
		if (!control) {
			return false;
		}
		if (this.didSubmitForm || control.dirty) {
			return !control.valid;
		}
		return false;
	}
	public confirmationControlIsInvalid(confirmationControlName: string, controlName: string, formGroup?: FormGroup): boolean {
		var isInvalid = this.controlIsInvalid(confirmationControlName, formGroup);
		if (isInvalid) {
			return true;
		}
		let confirmationControl: AbstractControl = this.getAbstractControl(confirmationControlName, formGroup);
		let control: AbstractControl = this.getAbstractControl(controlName, formGroup);
		return control.value !== confirmationControl.value && (confirmationControl.dirty || this._didSubmitForm);
	}

	private getAbstractControl(controlName: string, formGroup?: FormGroup): AbstractControl {
		var actualFormGroup: FormGroup = (!formGroup) ? this.getDefaultFormGroup() : formGroup;
		return actualFormGroup.controls[controlName];
	}
}