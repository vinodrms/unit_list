import {Component, Input, Output, EventEmitter} from '@angular/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {PercentagePipe} from '../../../../../../../../common/utils/pipes/PercentagePipe';
import {PriceProductVM} from '../../../../../../services/price-products/view-models/PriceProductVM';
import {PriceProductPriceConfigurationState} from '../../../../../../services/price-products/data-objects/price/IPriceProductPrice';
import {CustomScroll} from '../../../../../../../../common/utils/directives/CustomScroll';

@Component({
	selector: 'price-product-overview',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-overview/template/price-product-overview.html',
	pipes: [TranslationPipe, PercentagePipe],
	directives: [CustomScroll]
})

export class PriceProductOverviewComponent extends BaseComponent {
	private _priceProductVM: PriceProductVM;
	public get priceProductVM(): PriceProductVM {
		return this._priceProductVM;
	}
	@Input()
	public set priceProductVM(priceProductVM: PriceProductVM) {
		this._priceProductVM = priceProductVM;
	}

	@Output() onEdit = new EventEmitter();
	public editPriceProduct() {
		this.onEdit.next(this._priceProductVM);
	}

	@Output() onDelete = new EventEmitter();
	public deletePriceProduct() {
		this.onDelete.next(this._priceProductVM);
	}

	@Output() onArchive = new EventEmitter();
	public archivePriceProduct() {
		this.onArchive.next(this._priceProductVM);
	}

	@Output() onDraft = new EventEmitter();
	public draftPriceProduct() {
		this.onDraft.next(this._priceProductVM);
	}

	constructor() {
		super();
	}

	public priceConfigurationIsValid(): boolean {
		return this.priceProductVM.priceProduct.price.priceConfigurationState === PriceProductPriceConfigurationState.Valid;
	}
}