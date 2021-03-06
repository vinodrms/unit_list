import {Component, Input} from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {BaseFormComponent} from '../../../../../../../../../../common/base/BaseFormComponent';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {PriceProductAvailability} from '../../../../../../../../services/price-products/data-objects/PriceProductDO';

@Component({
	selector: 'price-product-edit-top-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/top-section/template/price-product-edit-top-section.html'
})
export class PriceProductEditTopSectionComponent extends BaseFormComponent implements IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	private _nameControl: FormControl;
	private _formGroup: FormGroup;
	private _isPublicAvailability: boolean;
	private _isLastRoomAvailabilityEnabled: boolean;

	constructor(private _formBuilder: FormBuilder) {
		super();
		this._nameControl = new FormControl("", Validators.compose([Validators.required, Validators.maxLength(200)]));
		this._formGroup = this._formBuilder.group({
			"name": this._nameControl
		})
	}

	public isValid(): boolean {
		return this._nameControl.valid;
	}
	public initializeFrom(priceProductVM: PriceProductVM) {
		this._nameControl.setValue(priceProductVM.priceProduct.name);
		this._isPublicAvailability = priceProductVM.priceProduct.availability === PriceProductAvailability.Public;
		this.isLastRoomAvailabilityEnabled = priceProductVM.priceProduct.lastRoomAvailability;
	}
	public updateDataOn(priceProductVM: PriceProductVM) {
		priceProductVM.priceProduct.name = this._nameControl.value;
		if (this._isPublicAvailability) {
			priceProductVM.priceProduct.availability = PriceProductAvailability.Public;
		}
		else {
			priceProductVM.priceProduct.availability = PriceProductAvailability.Confidential;
		}
		priceProductVM.priceProduct.lastRoomAvailability = this._isLastRoomAvailabilityEnabled;
	}

	public getDefaultFormGroup(): FormGroup {
		return this._formGroup;
	}
	protected get didSubmitForm(): boolean {
		return this.didSubmit;
	}

	public get isPublicAvailability(): boolean {
		return this._isPublicAvailability;
	}
	public set isPublicAvailability(isPublicAvailability: boolean) {
		if (!this.readonly) {
			this._isPublicAvailability = isPublicAvailability;
		}
	}
	public get isLastRoomAvailabilityEnabled(): boolean {
		return this._isLastRoomAvailabilityEnabled;
	}
	public set isLastRoomAvailabilityEnabled(isLastRoomAvailabilityEnabled: boolean) {
		if (!this.readonly) {
			this._isLastRoomAvailabilityEnabled = isLastRoomAvailabilityEnabled;
		}
	}
}