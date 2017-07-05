import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../../../../../../../../common/base/BaseComponent';
import {AppContext} from '../../../../../../../../../../common/utils/AppContext';
import {IPriceProductEditSection} from '../utils/IPriceProductEditSection';
import {PriceProductVM} from '../../../../../../../../services/price-products/view-models/PriceProductVM';
import {ModalDialogRef} from '../../../../../../../../../../common/utils/modals/utils/ModalDialogRef';
import {AddOnProductDO} from '../../../../../../../../services/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductSnapshotDO} from '../../../../../../../../services/add-on-products/data-objects/AddOnProductSnapshotDO';
import {PriceProductIncludedItemsDO} from '../../../../../../../../services/price-products/data-objects/included-items/PriceProductIncludedItemsDO';
import {AttachedAddOnProductItemDO} from '../../../../../../../../services/price-products/data-objects/included-items/AttachedAddOnProductItemDO';
import {AttachedAddOnProductItemFactory} from '../../../../../../../../services/price-products/data-objects/included-items/AttachedAddOnProductItemFactory';
import {IAttachedAddOnProductItemStrategy} from '../../../../../../../../services/price-products/data-objects/included-items/IAttachedAddOnProductItemStrategy';
import {CurrencyDO} from '../../../../../../../../services/common/data-objects/currency/CurrencyDO';
import { AddOnProductCategoriesDO } from '../../../../../../../../services/settings/data-objects/AddOnProductCategoriesDO';
import { AddOnProductsModalService } from "../../../../../add-on-products/modals/services/AddOnProductsModalService";

@Component({
	selector: 'price-product-edit-add-on-products-section',
	templateUrl: '/client/src/pages/internal/containers/common/inventory/price-products/pages/price-product-edit/sections/add-on-products/template/price-product-edit-add-on-products-section.html',
	providers: [AddOnProductsModalService]
})
export class PriceProductEditAddOnProductsSectionComponent extends BaseComponent implements IPriceProductEditSection {
	readonly: boolean;
	@Input() didSubmit: boolean;

	ccy: CurrencyDO;
	private _includedItemsDO: PriceProductIncludedItemsDO;
	private _itemFactory: AttachedAddOnProductItemFactory;
	private itemStrategyList: IAttachedAddOnProductItemStrategy[];

	constructor(private _appContext: AppContext,
		private _addOnProductsModalService: AddOnProductsModalService) {
		super();
		this._itemFactory = new AttachedAddOnProductItemFactory();
		this.itemStrategyList = this._itemFactory.getStrategyList();
	}

	public didInitialize(): boolean {
		return this.ccy != null;
	}

	public isValid(): boolean {
		return true;
	}
	public initializeFrom(priceProductVM: PriceProductVM, addOnProductCategories: AddOnProductCategoriesDO) {
		var includedItemsDO = priceProductVM.priceProduct.includedItems.buildPrototype();
		this.ccy = priceProductVM.ccy;
		_.forEach(includedItemsDO.attachedAddOnProductItemList, (aopItem: AttachedAddOnProductItemDO) => {
			this.updateStrategyInstanceOn(aopItem);
		});
		this._includedItemsDO = includedItemsDO;
	}

	public updateDataOn(priceProductVM: PriceProductVM) {
		priceProductVM.priceProduct.includedItems = this._includedItemsDO.buildPrototype();
	}
	private updateStrategyInstanceOn(aopItem: AttachedAddOnProductItemDO) {
		var strategyInstance = _.find(this.itemStrategyList, (itemStrategy: IAttachedAddOnProductItemStrategy) => {
			return aopItem.equals(itemStrategy);
		});
		aopItem.strategy = strategyInstance;
	}

	public removeAddOnProductItemAtIndex(indexToRemove: number) {
		var filteredItemList = [];
		for (var currIndex = 0; currIndex < this.addOnProductItemList.length; currIndex++) {
			if (currIndex !== indexToRemove) {
				filteredItemList.push(this.addOnProductItemList[currIndex]);
			}
		}
		this._includedItemsDO.attachedAddOnProductItemList = filteredItemList;
	}

	public openAddOnProductSelectModal() {
		this._addOnProductsModalService.openAddOnProductsModal().then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
			modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
				_.forEach(selectedAddOnProductList, (aop: AddOnProductDO) => {
					var aopItem = new AttachedAddOnProductItemDO();
					aopItem.addOnProductSnapshot = aop.getAddOnProductSnapshotDO();
					aopItem.strategy = this._itemFactory.getDefaultStrategy();
					aopItem.strategyType = aopItem.strategy.getStrategyType();
					this.updateStrategyInstanceOn(aopItem);
					this._includedItemsDO.attachedAddOnProductItemList.push(aopItem);
				});
			});
		}).catch((e: any) => { });
	}
	public openBreakfastSelectModal() {
		this._addOnProductsModalService.openBreakfastModal().then((modalDialogInstance: ModalDialogRef<AddOnProductDO[]>) => {
			modalDialogInstance.resultObservable.subscribe((selectedAddOnProductList: AddOnProductDO[]) => {
				if (selectedAddOnProductList.length > 0) {
					this._includedItemsDO.includedBreakfastAddOnProductSnapshot = selectedAddOnProductList[0].getAddOnProductSnapshotDO();
				}
			});
		}).catch((e: any) => { });
	}

	public get addOnProductItemList(): AttachedAddOnProductItemDO[] {
		return this._includedItemsDO.attachedAddOnProductItemList;
	}
	public get breakfastAopSnapshot(): AddOnProductSnapshotDO {
		return this._includedItemsDO.includedBreakfastAddOnProductSnapshot;
	}
	public getStrategyValueDisplayString(strategy: IAttachedAddOnProductItemStrategy): string {
		return strategy.getValueDisplayString(this._appContext.thTranslation);
	}
	public didChangeStrategyOn(addOnProductItem: AttachedAddOnProductItemDO, newStrategy: IAttachedAddOnProductItemStrategy) {
		addOnProductItem.strategyType = newStrategy.getStrategyType();
		addOnProductItem.strategy = newStrategy;
	}

	public didSelectBreakfast(): boolean {
		return this._includedItemsDO.hasBreakfast();
	}
	public removeBreakfast() {
		this._includedItemsDO.includedBreakfastAddOnProductSnapshot = new AddOnProductSnapshotDO();
	}

	public get includedItemsDO(): PriceProductIncludedItemsDO {
		return this._includedItemsDO;
	}
	public set includedItemsDO(includedItemsDO: PriceProductIncludedItemsDO) {
		this._includedItemsDO = includedItemsDO;
	}
}