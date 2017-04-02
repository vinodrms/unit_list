import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {AddOnProductDO} from '../../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {IAddOnProductItemActionStrategy} from '../IAddOnProductItemActionStrategy';
import {AddOnProductMetaRepoDO, AddOnProductItemMetaRepoDO} from '../../../../data-layer/add-on-products/repositories/IAddOnProductRepository';
import {PriceProductDO} from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import {
	PriceProductMetaRepoDO, PriceProductSearchCriteriaRepoDO,
	PriceProductItemMetaRepoDO, PriceProductSearchResultRepoDO
} from '../../../../data-layer/price-products/repositories/IPriceProductRepository';
import {PriceProductStatus} from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import {AddOnProductSnapshotDO} from '../../../../data-layer/add-on-products/data-objects/AddOnProductSnapshotDO';
import {ThUtils} from '../../../../utils/ThUtils'

import _ = require('underscore')

export class AddOnProductItemUpdateStrategy implements IAddOnProductItemActionStrategy {
	private _aopMeta: AddOnProductMetaRepoDO;
	private _loadedAddOnProduct: AddOnProductDO;
	private _updatedAddOnProduct: AddOnProductDO;
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _addOnProductDO: AddOnProductDO) {
		this._aopMeta = this.buildAddOnProductMetaRepoDO();
		this._thUtils = new ThUtils();
	}
	save(resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) {
		var aopRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
		aopRepo.getAddOnProductById(this._aopMeta, this._addOnProductDO.id)
			.then((loadedAddOnProduct: AddOnProductDO) => {
				this._loadedAddOnProduct = loadedAddOnProduct;

				var aopRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
				var itemMeta = this.buildAddOnProductItemMetaRepoDO();
				return aopRepo.updateAddOnProduct(this._aopMeta, itemMeta, this._addOnProductDO);
			})
			.then((updatedAddOnProduct: AddOnProductDO) => {
				this._updatedAddOnProduct = updatedAddOnProduct;
				return this.updateAssociatedPriceProducts();
			})
			.then(() => {
				resolve(this._updatedAddOnProduct);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.AddOnProductItemUpdateStrategyErrorUpdating, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating add on product", this._addOnProductDO, thError);
				}
				reject(thError);
			});
	}
	private updateAssociatedPriceProducts(): Promise<any> {
		return new Promise((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
			this.updateAssociatedPriceProductsCore(resolve, reject);
		});
	}
	private updateAssociatedPriceProductsCore(resolve: { (result: any): void }, reject: { (err: ThError): void }) {
		var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		ppRepo.getPriceProductList({ hotelId: this._sessionContext.sessionDO.hotel.id },
			{
				addOnProductIdList: [this._updatedAddOnProduct.id],
				status: PriceProductStatus.Active
			})
		.then((priceProductSearchResult: PriceProductSearchResultRepoDO) => {
			var priceProductList = priceProductSearchResult.priceProductList;
			let updatePriceProductsPromisesArray = [];
			for (let priceProduct of priceProductList) {
				let aop = _.find(priceProduct.includedItems.attachedAddOnProductItemList, aop => { return aop.addOnProductSnapshot.id === this._updatedAddOnProduct.id });
				if( !this._thUtils.isUndefinedOrNull(aop)) {
					this.updateAddOnProductSnapshotByAddOnProduct(aop.addOnProductSnapshot, this._updatedAddOnProduct);
				};
				var breakfastSnapshot = priceProduct.includedItems.includedBreakfastAddOnProductSnapshot;
				if (breakfastSnapshot.id == this._updatedAddOnProduct.id) {
					this.updateAddOnProductSnapshotByAddOnProduct(breakfastSnapshot,this._updatedAddOnProduct);
				}
				updatePriceProductsPromisesArray.push(ppRepo.updatePriceProduct({ hotelId: this._sessionContext.sessionDO.hotel.id },
				{
					id: priceProduct.id,
					versionId: priceProduct.versionId
				}, priceProduct));
			}
			Promise.all(updatePriceProductsPromisesArray)
			.then(() => {
				resolve(true);
			})
			.catch((error: any) => {
				var thError = new ThError(ThStatusCode.AddOnProductItemUpdateStrategyErrorUpdatingPriceProducts, null);
				ThLogger.getInstance().logError(ThLogLevel.Debug, "error updating price products", {}, thError);
				resolve(true);
			});
		}).catch((error: any) => {
			var thError = new ThError(ThStatusCode.AddOnProductItemUpdateStrategyErrorUpdatingPriceProducts, null);
			ThLogger.getInstance().logError(ThLogLevel.Debug, "error updating price products", {}, thError);
			resolve(true);
		});
	}
	private updateAddOnProductSnapshotByAddOnProduct(itemToUpdate: AddOnProductSnapshotDO , newValue: AddOnProductDO) {
		itemToUpdate.categoryId = newValue.categoryId;
		itemToUpdate.name = newValue.name;
		itemToUpdate.price = newValue.price;
		itemToUpdate.internalCost = newValue.internalCost;
		itemToUpdate.taxIdList = newValue.taxIdList;
	}
	private buildAddOnProductMetaRepoDO(): AddOnProductMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
	private buildAddOnProductItemMetaRepoDO(): AddOnProductItemMetaRepoDO {
		return {
			id: this._loadedAddOnProduct.id,
			versionId: this._loadedAddOnProduct.versionId
		};
	}
}