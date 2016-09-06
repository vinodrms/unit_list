import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../../../../../common/base/BaseComponent';
import {EagerAddOnProductsService} from '../../../../../../../../../../../../services/add-on-products/EagerAddOnProductsService';
import {AddOnProductsDO} from '../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductsDO';
import {AddOnProductDO} from '../../../../../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {ThError, AppContext} from '../../../../../../../../../../../../../../common/utils/AppContext';
import {ICustomModalComponent, ModalSize} from '../../../../../../../../../../../../../../common/utils/modals/utils/ICustomModalComponent';
import {ModalDialogRef} from '../../../../../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {NumberOfAddOnProductsModalInput} from './services/utils/NumberOfAddOnProductsModalInput';
import {NumberOfAddOnProductsModalOutput} from './services/utils/NumberOfAddOnProductsModalOutput';

@Component({
	selector: 'number-of-aop-modal',
	templateUrl: '/client/src/pages/internal/containers/home/pages/home-pages/hotel-operations/operations-modal/components/components/invoice-operations/components/invoice-edit/modals/template/number-of-aop-modal.html',
	providers: [EagerAddOnProductsService]
})
export class NumberOfAddOnProductsModalComponent extends BaseComponent implements ICustomModalComponent, OnInit {
	private static DEFAULT_NO_OF_AOPS = 1;
	private _numberOfAddOnProductsModalOutput: NumberOfAddOnProductsModalOutput;

	constructor(private _appContext: AppContext,
		private _eagerAddOnProductsService: EagerAddOnProductsService,
		private _modalDialogRef: ModalDialogRef<NumberOfAddOnProductsModalOutput>,
		private _modalInput: NumberOfAddOnProductsModalInput) {
		super();

		this._numberOfAddOnProductsModalOutput = new NumberOfAddOnProductsModalOutput();
	}

	public ngOnInit() {
		this._eagerAddOnProductsService.getAddOnProductsById([this._modalInput.addOnProductId]).subscribe((addOnProducts: AddOnProductsDO) => {
			var aopList = addOnProducts.addOnProductList;
			if (!_.isEmpty(aopList)) {
				this._numberOfAddOnProductsModalOutput.aop = aopList[0];
				this._numberOfAddOnProductsModalOutput.noOfItems = NumberOfAddOnProductsModalComponent.DEFAULT_NO_OF_AOPS;
			}
		});
	}

	public get numberOfAddOnProductsModalOutput(): NumberOfAddOnProductsModalOutput {
		return this._numberOfAddOnProductsModalOutput;
	}

	public get pageTitle(): string {
		return "Select Qty";
	}

	public closeDialog() {
		this._modalDialogRef.closeForced();
	}

	public isBlocking(): boolean {
		return false;
	}
	public getSize(): ModalSize {
		return ModalSize.Small;
	}

	public didSelectQtyGreaterOrLowerThanZero(): boolean {
		return this._numberOfAddOnProductsModalOutput.noOfItems != 0;
	}

	public triggerSelectedQty() {
		if (!this.didSelectQtyGreaterOrLowerThanZero()) {
			return;
		}
		this._modalDialogRef.addResult(this.numberOfAddOnProductsModalOutput);
		this.closeDialog();
	}
}