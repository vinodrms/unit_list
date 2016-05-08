import {ControlGroup, AbstractControl} from '@angular/common';
import {BaseComponent} from './BaseComponent';

export abstract class BaseFormComponent extends BaseComponent {
	private _didSubmitForm: boolean = false;

	protected set didSubmitForm(didSubmitForm: boolean) {
		this._didSubmitForm = didSubmitForm;
	}
	protected get didSubmitForm(): boolean {
		return this._didSubmitForm;
	}

	protected abstract getDefaultControlGroup(): ControlGroup;

	private getAbstractControl(controlName: string, controlGroup?: ControlGroup): AbstractControl {
		var fieldCG: ControlGroup = (!controlGroup) ? this.getDefaultControlGroup() : controlGroup;
		return fieldCG.find(controlName);
	}

	public controlIsInvalid(controlName: string, controlGroup?: ControlGroup): boolean {
		let control: AbstractControl = this.getAbstractControl(controlName, controlGroup);
		if (!control) {
			return false;
		}
		if (this.didSubmitForm || control.dirty) {
			return !control.valid;
		}
		return false;
	}
	public confirmationControlIsInvalid(confirmationControlName: string, controlName: string, controlGroup?: ControlGroup): boolean {
		var isInvalid = this.controlIsInvalid(confirmationControlName, controlGroup);
		if (isInvalid) {
			return true;
		}
		let confirmationControl: AbstractControl = this.getAbstractControl(confirmationControlName, controlGroup);
		let control: AbstractControl = this.getAbstractControl(controlName, controlGroup);
		return control.value !== confirmationControl.value && (confirmationControl.dirty || this._didSubmitForm);
	}
}