import { Component, Input } from '@angular/core';
import { BaseComponent } from "../../../../../../../../../../../common/base/BaseComponent";
import { AppContext } from "../../../../../../../../../../../common/utils/AppContext";
import { DynamicPriceVMContainer } from "../utils/DynamicPriceVMContainer";
import { PriceVM } from "../utils/PriceVM";
import { DynamicPriceVM } from "../utils/DynamicPriceVM";

@Component({
	selector: 'dynamic-price-container',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/prices/dynamic-price-container/template/dynamic-price-container.html',
	providers: []
})
export class DynamicPriceContainerComponent extends BaseComponent {
	@Input() dynamicPriceVMContainer: DynamicPriceVMContainer;

	constructor(private _appContext: AppContext) {
		super();
	}
	
}