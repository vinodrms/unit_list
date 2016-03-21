import {ControlGroup, AbstractControl} from 'angular2/common';
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

	public controlIsInvalid(controlName: string, controlGroup?: ControlGroup): boolean {
		var fieldCG: ControlGroup = (!controlGroup) ? this.getDefaultControlGroup() : controlGroup;
		let control: AbstractControl = fieldCG.find(controlName);
		if (!control) {
			return false;
		}
		if (this._didSubmitForm || control.dirty) {
			return !control.valid;
		}
		return false;
	}
}