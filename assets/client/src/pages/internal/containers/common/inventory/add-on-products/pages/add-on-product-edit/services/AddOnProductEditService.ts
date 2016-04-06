import {Injectable} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators, AbstractControl, Control} from 'angular2/common';
import {AddOnProductVM} from '../../../../../../../services/add-on-products/view-models/AddOnProductVM';
import {AddOnProductDO} from '../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {ThValidators, ThFieldLengths} from '../../../../../../../../../common/utils/form-utils/ThFormUtils';

@Injectable()
export class AddOnProductEditService {
	private _nameControl: Control;
	private _priceControl: Control;
	private _internalCostControl: Control;
	private _notesControl: Control;

	private _addOnProductForm: ControlGroup;

	constructor(private _formBuilder: FormBuilder) {
		this.initFormControls();
		this.initFormGroup();
	}
	private initFormControls() {
		this._nameControl = new Control(null, Validators.compose([Validators.required, Validators.maxLength(200)]));
		this._priceControl = new Control(null, Validators.compose([Validators.required, ThValidators.priceValidator]));
		this._internalCostControl = new Control(null, Validators.compose([ThValidators.nullablePriceValidator]));
		this._notesControl = new Control(null, Validators.compose([Validators.maxLength(2000)]));
	}
	private initFormGroup() {
		this._addOnProductForm = this._formBuilder.group({
			"name": this._nameControl,
			"price": this._priceControl,
			"internalCost": this._internalCostControl,
			"notes": this._notesControl
		})
	}

	public updateFormValues(addOnProductVM: AddOnProductVM) {
		var addOnProductDO = addOnProductVM.addOnProduct;
		this._nameControl.updateValue(addOnProductDO.name);
		this._priceControl.updateValue(addOnProductDO.price);
		this._internalCostControl.updateValue(addOnProductDO.internalCost);
		this._notesControl.updateValue(addOnProductDO.notes);
	}

	public updateAddOnProduct(addOnProduct: AddOnProductDO) {
		addOnProduct.name = this._addOnProductForm.value["name"];
		addOnProduct.price = this._addOnProductForm.value["price"];
		addOnProduct.internalCost = this._addOnProductForm.value["internalCost"];
		addOnProduct.notes = this._addOnProductForm.value["notes"];
	}

	public isValidForm(): boolean {
		return this._addOnProductForm.valid;
	}

	public get addOnProductForm(): ControlGroup {
		return this._addOnProductForm;
	}
	public set addOnProductForm(addOnProductForm: ControlGroup) {
		this._addOnProductForm = addOnProductForm;
	}
}