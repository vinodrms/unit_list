import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl} from '@angular/forms';
import {AddOnProductVM} from '../../../../../../../services/add-on-products/view-models/AddOnProductVM';
import {AddOnProductDO} from '../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {ThValidators, ThFieldLengths} from '../../../../../../../../../common/utils/form-utils/ThFormUtils';

@Injectable()
export class AddOnProductEditService {
	private _nameControl: FormControl;
	private _priceControl: FormControl;
	private _internalCostControl: FormControl;
	private _notesControl: FormControl;

	private _addOnProductForm: FormGroup;

	constructor(private _formBuilder: FormBuilder) {
		this.initFormControls();
		this.initFormGroup();
	}
	private initFormControls() {
		this._nameControl = new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(200)]));
		this._priceControl = new FormControl(null, Validators.compose([Validators.required, ThValidators.priceValidator]));
		this._internalCostControl = new FormControl(null, Validators.compose([ThValidators.nullablePriceValidator]));
		this._notesControl = new FormControl(null, Validators.compose([Validators.maxLength(2000)]));
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
		this._nameControl.setValue(addOnProductDO.name);
		this._priceControl.setValue(addOnProductDO.price);
		this._internalCostControl.setValue(addOnProductDO.internalCost);
		this._notesControl.setValue(addOnProductDO.notes);
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

	public get addOnProductForm(): FormGroup {
		return this._addOnProductForm;
	}
	public set addOnProductForm(addOnProductForm: FormGroup) {
		this._addOnProductForm = addOnProductForm;
	}
}