import { PriceProductDO } from '../../../../data-layer/price-products/data-objects/PriceProductDO';
import { ThDateIntervalDO } from '../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ThDateUtils } from '../../../../utils/th-dates/ThDateUtils';
import { ThUtils } from '../../../../utils/ThUtils';
import { AddOnProductsContainer } from '../../../add-on-products/validators/results/AddOnProductsContainer';
import { AttachedAddOnProductItemDO } from '../../../../data-layer/price-products/data-objects/included-items/AttachedAddOnProductItemDO';
import { DynamicPriceDO } from "../../../../data-layer/price-products/data-objects/price/DynamicPriceDO";

import _ = require("underscore");

export class PriceProductActionUtils {
	private _thDateUtils: ThDateUtils;
	private _thUtils: ThUtils;

	constructor() {
		this._thDateUtils = new ThDateUtils();
		this._thUtils = new ThUtils();
	}

	/**
	 * Sets the default yild intervals (opens for arrival/departure/stay forever)
	 * Rounds the prices to 2 decimals 
	 * Sets the default `enabledDynamicPriceIdByDate` for the price product's price
	 */
	public populateDefaultValuesOn(priceProduct: PriceProductDO) {
		priceProduct.openIntervalList = this.getDefaultIntervals();
		priceProduct.openForArrivalIntervalList = this.getDefaultIntervals();
		priceProduct.openForDepartureIntervalList = this.getDefaultIntervals();
		priceProduct.price.roundPricesToTwoDecimals();
		priceProduct.price.enabledDynamicPriceIdByDate = {};
	}

	public populateDynamicPriceIdsOn(priceProduct: PriceProductDO) {
		priceProduct.price.dynamicPriceList = _.map(priceProduct.price.dynamicPriceList, (dynamicPrice: DynamicPriceDO​​) => {
			dynamicPrice.id = this.generateDynamicPriceId();
			return dynamicPrice;
		});
	}

	private getDefaultIntervals(): ThDateIntervalDO[] {
		var minDate = this._thDateUtils.getMinThDateDO();
		var maxDate = this._thDateUtils.getMaxThDateDO();
		var defaultIntervalList: ThDateIntervalDO[] = [
			ThDateIntervalDO.buildThDateIntervalDO(minDate, maxDate)
		];
		return defaultIntervalList;
	}

	public updateIncludedItems(priceProduct: PriceProductDO, aopContainer: AddOnProductsContainer) {
		if (priceProduct.includedItems.hasBreakfast()) {
			var breakfastId = priceProduct.includedItems.includedBreakfastAddOnProductSnapshot.id;
			var breakfastAddOnProduct = aopContainer.getAddOnProductById(breakfastId);
			if (!this._thUtils.isUndefinedOrNull(breakfastAddOnProduct)) {
				priceProduct.includedItems.includedBreakfastAddOnProductSnapshot = breakfastAddOnProduct.getAddOnProductSnapshotDO();
			}
		}
		_.forEach(priceProduct.includedItems.attachedAddOnProductItemList, (aopItem: AttachedAddOnProductItemDO) => {
			var addOnProduct = aopContainer.getAddOnProductById(aopItem.addOnProductSnapshot.id);
			if (!this._thUtils.isUndefinedOrNull(addOnProduct)) {
				aopItem.addOnProductSnapshot = addOnProduct.getAddOnProductSnapshotDO();
			}
		});
		priceProduct.includedItems.indexedAddOnProductIdList = priceProduct.includedItems.getUniqueAddOnProductIdList();
	}

	public generateDynamicPriceId(): string {
		return this._thUtils.generateUniqueID();
	}
}