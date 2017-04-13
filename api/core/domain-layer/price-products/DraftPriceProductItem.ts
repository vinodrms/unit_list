import { ThLogger, ThLogLevel } from '../../utils/logging/ThLogger';
import { ThError } from '../../utils/th-responses/ThError';
import { ThStatusCode } from '../../utils/th-responses/ThResponse';
import { AppContext } from '../../utils/AppContext';
import { SessionContext } from '../../utils/SessionContext';
import { ThUtils } from '../../utils/ThUtils';
import { PriceProductInputIdDO } from './validation-structures/PriceProductInputIdDO';
import { PriceProductDO, PriceProductStatus } from '../../data-layer/price-products/data-objects/PriceProductDO';
import { AttachedAddOnProductItemDO } from '../../data-layer/price-products/data-objects/included-items/AttachedAddOnProductItemDO';
import { ValidationResultParser } from '../common/ValidationResultParser';
import { TaxResponseRepoDO } from '../../data-layer/taxes/repositories/ITaxRepository';
import { RoomCategorySearchResultRepoDO } from '../../data-layer/room-categories/repositories/IRoomCategoryRepository';
import { TaxDO } from '../../data-layer/taxes/data-objects/TaxDO';
import { RoomCategoryDO } from '../../data-layer/room-categories/data-objects/RoomCategoryDO';
import { AddOnProductDO } from '../../data-layer/add-on-products/data-objects/AddOnProductDO';
import { AddOnProductSearchResultRepoDO } from '../../data-layer/add-on-products/repositories/IAddOnProductRepository';

import _ = require("underscore");

export class DraftPriceProductItem {
	private _thUtils: ThUtils;
	private _inputDO: PriceProductInputIdDO;

	private _priceProduct: PriceProductDO;
	private _validTaxes: TaxDO[];
	private _validRoomCategoryList: RoomCategoryDO[];
	private _validAddOnProductList: AddOnProductDO[];

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public draft(inputDO: PriceProductInputIdDO): Promise<PriceProductDO> {
		this._inputDO = inputDO;
		return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
			this.draftCore(resolve, reject);
		});
	}
	private draftCore(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		var validationResult = PriceProductInputIdDO.getValidationStructure().validateStructure(this._inputDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._inputDO);
			parser.logAndReject("Error validating data for archive price product", reject);
			return false;
		}
		var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		ppRepo.getPriceProductById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._inputDO.id)
			.then((priceProduct: PriceProductDO) => {
				if (priceProduct.status !== PriceProductStatus.Archived) {
					var thError = new ThError(ThStatusCode.DraftPriceProductItemOnlyArchived, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "only archived price products can be marked as draft", this._inputDO, thError);
					throw thError;
				}
				this._priceProduct = priceProduct;

				var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
				return taxRepo.getTaxList({ hotelId: this._sessionContext.sessionDO.hotel.id });
			})
			.then((taxResponse: TaxResponseRepoDO) => {
				var allTaxes: TaxDO[] = taxResponse.otherTaxList;
				allTaxes = allTaxes.concat(taxResponse.vatList);
				this._validTaxes = _.filter(allTaxes, (tax: TaxDO) => {
					return _.contains(this._priceProduct.taxIdList, tax.id);
				});

				var roomCategRepo = this._appContext.getRepositoryFactory().getRoomCategoryRepository();
				return roomCategRepo.getRoomCategoryList({ hotelId: this._sessionContext.sessionDO.hotel.id },
					{
						categoryIdList: this._priceProduct.roomCategoryIdList
					});
			})
			.then((roomCategSearch: RoomCategorySearchResultRepoDO) => {
				this._validRoomCategoryList = roomCategSearch.roomCategoryList;

				var aopRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
				return aopRepo.getAddOnProductList({ hotelId: this._sessionContext.sessionDO.hotel.id },
					{
						addOnProductIdList: this._priceProduct.includedItems.getUniqueAddOnProductIdList()
					});
			})
			.then((aopSearch: AddOnProductSearchResultRepoDO) => {
				this._validAddOnProductList = aopSearch.addOnProductList;

				this._priceProduct.taxIdList = _.map(this._validTaxes, (tax: TaxDO) => { return tax.id });
				this._priceProduct.roomCategoryIdList = _.map(this._validRoomCategoryList, (roomCateg: RoomCategoryDO) => { return roomCateg.id });

				this.deleteBreakfastIfInvalid();
				this._priceProduct.includedItems.attachedAddOnProductItemList =
					_.filter(this._priceProduct.includedItems.attachedAddOnProductItemList, (item: AttachedAddOnProductItemDO) => {
						return this.addOnProductIdIsValid(item.addOnProductSnapshot.id);
					});
				this._priceProduct.includedItems.indexedAddOnProductIdList = this._priceProduct.includedItems.getUniqueAddOnProductIdList()

				this._priceProduct.status = PriceProductStatus.Draft;
				this._priceProduct.deleteReferenceToParent();

				var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
				return ppRepo.updatePriceProduct({ hotelId: this._sessionContext.sessionDO.hotel.id },
					{ id: this._priceProduct.id, versionId: this._priceProduct.versionId }, this._priceProduct);
			})
			.then((updatedPriceProduct: PriceProductDO) => {
				resolve(updatedPriceProduct);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.DraftPriceProductItemError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating the status for price product", this._inputDO, thError);
				}
				reject(thError);
			});
	}
	private deleteBreakfastIfInvalid() {
		var breakfastAopId = this._priceProduct.includedItems.includedBreakfastAddOnProductSnapshot.id;
		if (this.addOnProductIdIsValid(breakfastAopId)) {
			return;
		}
		delete this._priceProduct.includedItems.includedBreakfastAddOnProductSnapshot.id;
		delete this._priceProduct.includedItems.includedBreakfastAddOnProductSnapshot.internalCost;
		delete this._priceProduct.includedItems.includedBreakfastAddOnProductSnapshot.name;
		delete this._priceProduct.includedItems.includedBreakfastAddOnProductSnapshot.price;
	}
	private addOnProductIdIsValid(addOnProductId: string) {
		var foundAddOnProduct = this.getAddOnProductById(addOnProductId);
		return !this._thUtils.isUndefinedOrNull(foundAddOnProduct);
	}
	private getAddOnProductById(addOnProductId: string): AddOnProductDO {
		return _.find(this._validAddOnProductList, (addOnProduct: AddOnProductDO) => {
			return addOnProduct.id === addOnProductId;
		})
	}
}