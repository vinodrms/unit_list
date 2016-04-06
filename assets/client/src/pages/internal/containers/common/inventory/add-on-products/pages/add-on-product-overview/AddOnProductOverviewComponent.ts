import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {BaseComponent} from '../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../common/utils/localization/TranslationPipe';
import {PricePipe} from '../../../../../../../../common/utils/pipes/PricePipe';
import {AddOnProductVM} from '../../../../../../services/add-on-products/view-models/AddOnProductVM';

@Component({
	selector: 'add-on-product-overview',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/add-on-products/pages/add-on-product-overview/template/add-on-product-overview.html',
	pipes: [TranslationPipe, PricePipe]
})

export class AddOnProductOverviewComponent extends BaseComponent {
	imageUrl: string = "";

	private _addOnProductVM: AddOnProductVM;
	public get addOnProductVM(): AddOnProductVM {
		return this._addOnProductVM;
	}
	@Input()
	public set addOnProductVM(addOnProductVM: AddOnProductVM) {
		this._addOnProductVM = addOnProductVM;
		if (this._addOnProductVM.addOnProduct.fileUrlList && this._addOnProductVM.addOnProduct.fileUrlList.length > 0) {
			this.imageUrl = this._addOnProductVM.addOnProduct.fileUrlList[0];
		}
	}

	@Output() onEdit = new EventEmitter();
	public editAddOnProduct() {
		this.onEdit.next(this._addOnProductVM);
	}

	constructor() {
		super();
	}
}