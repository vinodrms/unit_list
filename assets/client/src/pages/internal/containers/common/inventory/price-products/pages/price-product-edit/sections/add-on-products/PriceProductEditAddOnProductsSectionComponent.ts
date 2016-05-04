import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {TranslationPipe} from '../../../../../../../../../../common/utils/localization/TranslationPipe';
import {PricePipe} from '../../../../../../../../../../common/utils/pipes/PricePipe';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {AddOnProductsModalService} from '../../../../../add-on-products/modal/services/AddOnProductsModalService';
import {AddOnProductDO} from '../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';

@Component({
	selector: 'price-product-edit-add-on-products-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/add-on-products/template/price-product-edit-add-on-products-section.html',
	providers: [AddOnProductsModalService],
	pipes: [TranslationPipe, PricePipe]
})
export class PriceProductEditAddOnProductsSectionComponent extends BaseComponent implements IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	ccy: CurrencyDO;
	private _addOnProductList: AddOnProductDO[];

	constructor(private _addOnProductsModalService: AddOnProductsModalService) {
		super();
	}

	public didInitialize(): boolean {
		return this.ccy != null;
	}

	public isValid(): boolean {
		return true;
	}
	public initializeFrom(priceProductVM: PriceProductVM) {
		this._addOnProductList = [];
		if (priceProductVM.addOnProductList && priceProductVM.addOnProductList.length > 0) {
			this._addOnProductList = this._addOnProductList.concat(priceProductVM.addOnProductList);
		}
		this.ccy = priceProductVM.ccy;
	}
	public updateDataOn(priceProductVM: PriceProductVM) {
		priceProductVM.addOnProductList = this._addOnProductList;
		priceProductVM.priceProduct.addOnProductIdList = _.map(this._addOnProductList, (addOnProduct: AddOnProductDO) => { return addOnProduct.id });
	}

	public removeAddOnProduct(addOnProduct: AddOnProductDO) {
		this._addOnProductList = _.filter(this._addOnProductList, (innerAddOnProduct: AddOnProductDO) => { return innerAddOnProduct.id !== addOnProduct.id });
	}

	public openAddOnProductSelectModal() {
		this._addOnProductsModalService.openAddOnProductsModal().then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
			modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
				_.forEach(selectedAddOnProductList, (aop: AddOnProductDO) => {
					this.addAddOnProductIfNotExists(aop);
				});
			});
		}).catch((e: any) => { });
	}
	private addAddOnProductIfNotExists(addOnProductToAdd: AddOnProductDO) {
		var foundAddOnProduct = _.find(this._addOnProductList, (addOnProduct: AddOnProductDO) => { return addOnProduct.id === addOnProductToAdd.id });
		if (!foundAddOnProduct) {
			this._addOnProductList.push(addOnProductToAdd);
		}
	}

	public get addOnProductList(): AddOnProductDO[] {
		return this._addOnProductList;
	}
	public set addOnProductList(addOnProductList: AddOnProductDO[]) {
		this._addOnProductList = addOnProductList;
	}
}