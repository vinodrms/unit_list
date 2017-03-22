import { Component, Input } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../common/base/BaseComponent";
import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";

@Component({
	selector: 'dynamic-price-edit',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/dynamic-price-edit/template/dynamic-price-edit.html',
	providers: []
})
export class DynamicPriceEditComponent extends BaseComponent {
	readonly: boolean;
	@Input() didSubmit: boolean;
	
	private _isPricePerNumberOfPersons: boolean;
	isLoading: boolean = false;

	constructor(private _appContext: AppContext) {
		super();
	}
}