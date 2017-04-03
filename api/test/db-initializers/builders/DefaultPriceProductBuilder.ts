import { TestUtils } from '../../helpers/TestUtils';
import { ThError } from '../../../core/utils/th-responses/ThError';
import { TestContext } from '../../helpers/TestContext';
import { PriceProductActionUtils } from '../../../core/domain-layer/price-products/save-actions/utils/PriceProductActionUtils';
import { DefaultHotelBuilder } from './DefaultHotelBuilder';
import { TaxResponseRepoDO } from '../../../core/data-layer/taxes/repositories/ITaxRepository';
import { AddOnProductDO } from '../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import { PriceProductDO, PriceProductStatus, PriceProductAvailability } from '../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductConditionsDO } from '../../../core/data-layer/price-products/data-objects/conditions/PriceProductConditionsDO';
import { PriceProductCancellationPolicyType } from '../../../core/data-layer/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import { PriceProductCancellationPenaltyType } from '../../../core/data-layer/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import { NoCancellationPolicyDO } from '../../../core/data-layer/price-products/data-objects/conditions/cancellation/NoCancellationPolicyDO';
import { NoCancellationPenaltyDO } from '../../../core/data-layer/price-products/data-objects/conditions/penalty/NoCancellationPenaltyDO';
import { PriceProductConstraintWrapperDO } from '../../../core/data-layer/price-products/data-objects/constraint/PriceProductConstraintWrapperDO';
import { PricePerPersonDO } from '../../../core/data-layer/price-products/data-objects/price/price-per-person/PricePerPersonDO';
import { PriceForFixedNumberOfPersonsDO } from '../../../core/data-layer/price-products/data-objects/price/price-per-person/PriceForFixedNumberOfPersonsDO';
import { PriceProductPriceDO } from '../../../core/data-layer/price-products/data-objects/price/PriceProductPriceDO';
import { PriceProductPriceType } from '../../../core/data-layer/price-products/data-objects/price/IPriceProductPrice';
import { DynamicPriceDO } from "../../../core/data-layer/price-products/data-objects/price/DynamicPriceDO";
import { PriceExceptionDO } from '../../../core/data-layer/price-products/data-objects/price/price-exceptions/PriceExceptionDO';
import { PriceProductIncludedItemsDO } from '../../../core/data-layer/price-products/data-objects/included-items/PriceProductIncludedItemsDO';
import { AttachedAddOnProductItemDO } from '../../../core/data-layer/price-products/data-objects/included-items/AttachedAddOnProductItemDO';
import { AttachedAddOnProductItemStrategyType } from '../../../core/data-layer/price-products/data-objects/included-items/IAttachedAddOnProductItemStrategy';
import { FixedNumberAttachedAddOnProductItemStrategyDO } from '../../../core/data-layer/price-products/data-objects/included-items/strategies/FixedNumberAttachedAddOnProductItemStrategyDO';
import { SinglePriceDO } from '../../../core/data-layer/price-products/data-objects/price/single-price/SinglePriceDO';
import { RoomCategoryStatsDO } from '../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { ThTimestampDO } from '../../../core/utils/th-dates/data-objects/ThTimestampDO';
import { PriceProductDiscountWrapperDO } from "../../../core/data-layer/price-products/data-objects/discount/PriceProductDiscountWrapperDO";

import _ = require('underscore');
import { PriceProductDiscountDO } from "../../../core/data-layer/price-products/data-objects/discount/PriceProductDiscountDO";
import { PriceProductConstraintDO } from "../../../core/data-layer/price-products/data-objects/constraint/PriceProductConstraintDO";
import { PriceProductConstraintType } from "../../../core/data-layer/price-products/data-objects/constraint/IPriceProductConstraint";
import { IncludeDaysFromWeekConstraintDO } from "../../../core/data-layer/price-products/data-objects/constraint/constraints/IncludeDaysFromWeekConstraintDO";
import { ISOWeekDay } from "../../../core/utils/th-dates/data-objects/ISOWeekDay";
import { ThDateIntervalDO } from "../../../core/utils/th-dates/data-objects/ThDateIntervalDO";
import { ThDateDO } from "../../../core/utils/th-dates/data-objects/ThDateDO";
import { PriceProductDiscountIntervalWrapperDO } from "../../../core/data-layer/price-products/data-objects/discount/PriceProductDiscountIntervalWrapperDO";

export interface IPriceProductDataSource {
	getPriceProductList(roomCategoryStatsList: RoomCategoryStatsDO[], taxes: TaxResponseRepoDO,
		addOnProductList: AddOnProductDO[], breakfastAopCategoryId: string): PriceProductDO[];
}

export class DefaultPriceProductBuilder implements IPriceProductDataSource {
	private _testUtils: TestUtils;

	constructor(private _testContext: TestContext) {
		this._testUtils = new TestUtils();
	}

	public getPriceProductList(roomCategoryStatsList: RoomCategoryStatsDO[], taxes: TaxResponseRepoDO,
		addOnProductList: AddOnProductDO[], breakfastAopCategoryId: string): PriceProductDO[] {
		var ppList: PriceProductDO[] = [];
		var taxId = this._testUtils.getRandomListElement(taxes.vatList).id;

		var breakfastAddOnProduct = _.find(addOnProductList, (aop: AddOnProductDO) => { return aop.categoryId === breakfastAopCategoryId });
		var addOnProduct = _.find(addOnProductList, (aop: AddOnProductDO) => { return aop.categoryId !== breakfastAopCategoryId });
		ppList.push(DefaultPriceProductBuilder.buildPriceProductDO(this._testContext, "Price Product 1", this._testUtils.getRandomListElement(roomCategoryStatsList), taxId,
			breakfastAddOnProduct, addOnProduct, PriceProductPriceType.PricePerPerson));
		ppList.push(DefaultPriceProductBuilder.buildPriceProductDO(this._testContext, "Price Product 2", this._testUtils.getRandomListElement(roomCategoryStatsList), taxId,
			breakfastAddOnProduct, addOnProduct, PriceProductPriceType.SinglePrice));
		var confidentialPriceProduct = DefaultPriceProductBuilder.buildPriceProductDO(this._testContext, "Price Product 3 (Private)", this._testUtils.getRandomListElement(roomCategoryStatsList), taxId,
			breakfastAddOnProduct, addOnProduct, PriceProductPriceType.SinglePrice);
		confidentialPriceProduct.availability = PriceProductAvailability.Confidential;
		ppList.push(confidentialPriceProduct);

		let discountPriceProduct = DefaultPriceProductBuilder.buildPriceProductDO(this._testContext, "Price Product 4 (Discount)", this._testUtils.getRandomListElement(roomCategoryStatsList), taxId,
			breakfastAddOnProduct, addOnProduct, PriceProductPriceType.SinglePrice);
		discountPriceProduct.discounts = DefaultPriceProductBuilder.buildPriceProductDiscount();
		ppList.push(discountPriceProduct);
		return ppList;
	}

	public static buildPriceProductDiscount(): PriceProductDiscountWrapperDO {
		let ppDiscount = new PriceProductDiscountDO();
		ppDiscount.name = "Summer discount";
		ppDiscount.value = 0.1;
		
		let includeDaysFromWeekConstraint = new IncludeDaysFromWeekConstraintDO();
		includeDaysFromWeekConstraint.daysFromWeek = [ISOWeekDay.Monday, ISOWeekDay.Sunday];
		
		let ppConstraint = new PriceProductConstraintDO();
		ppConstraint.type = PriceProductConstraintType.IncludeDaysFromWeek;
		ppConstraint.constraint = includeDaysFromWeekConstraint;
		
		let ppDiscountConstraintsWrapper = new PriceProductConstraintWrapperDO();
		ppDiscountConstraintsWrapper.constraintList = [];
		ppDiscountConstraintsWrapper.constraintList.push(ppConstraint);
		ppDiscount.constraints = ppDiscountConstraintsWrapper;
		
		let startDate = new ThDateDO();
		startDate.day = 1;
		startDate.month = 6;
		startDate.year = 2017;
		let endDate = new ThDateDO();
		endDate.day = 30;
		endDate.month = 6;
		endDate.year = 2017;
		
		let ppDiscountInterval = new ThDateIntervalDO();
		ppDiscountInterval.start = startDate;
		ppDiscountInterval.end = endDate; 
		
		ppDiscount.intervals = new PriceProductDiscountIntervalWrapperDO();
		ppDiscount.intervals.intervalList = [];
		ppDiscount.intervals.intervalList.push(ppDiscountInterval);

		let ppDiscountWrapper = new PriceProductDiscountWrapperDO();
		ppDiscountWrapper.discountList = [];
		ppDiscountWrapper.discountList.push(ppDiscount);
		
		return ppDiscountWrapper;
	}

	public static buildPriceProductDO(testContext: TestContext, name: string, roomCategoryStat: RoomCategoryStatsDO, taxId: string, breakfastAddOnProduct: AddOnProductDO, addOnProduct: AddOnProductDO, priceType: PriceProductPriceType): PriceProductDO {
		var ppUtils = new PriceProductActionUtils();
		var priceProduct = new PriceProductDO();
		priceProduct.includedItems = new PriceProductIncludedItemsDO();
		priceProduct.includedItems.includedBreakfastAddOnProductSnapshot = breakfastAddOnProduct.getAddOnProductSnapshotDO();
		var aopItem = new AttachedAddOnProductItemDO();
		aopItem.addOnProductSnapshot = addOnProduct.getAddOnProductSnapshotDO();
		aopItem.strategyType = AttachedAddOnProductItemStrategyType.FixedNumber;
		var strategy = new FixedNumberAttachedAddOnProductItemStrategyDO();
		strategy.noOfItems = 1;
		aopItem.strategy = strategy;
		priceProduct.includedItems.attachedAddOnProductItemList = [aopItem];
		priceProduct.includedItems.indexedAddOnProductIdList = priceProduct.includedItems.getUniqueAddOnProductIdList();

		priceProduct.availability = PriceProductAvailability.Public;
		priceProduct.conditions = new PriceProductConditionsDO();
		priceProduct.conditions.policyType = PriceProductCancellationPolicyType.NoPolicy;
		priceProduct.conditions.policy = new NoCancellationPolicyDO();
		priceProduct.conditions.penaltyType = PriceProductCancellationPenaltyType.NoPenalty;
		priceProduct.conditions.penalty = new NoCancellationPenaltyDO();
		priceProduct.constraints = new PriceProductConstraintWrapperDO();
		priceProduct.constraints.constraintList = [];
		priceProduct.discounts = new PriceProductDiscountWrapperDO();
		priceProduct.discounts.discountList = [];
		priceProduct.hotelId = testContext.sessionContext.sessionDO.hotel.id;
		priceProduct.lastRoomAvailability = false;
		priceProduct.name = name;

		switch (priceType) {
			case PriceProductPriceType.PricePerPerson:
				priceProduct.price = DefaultPriceProductBuilder.getPricePerPerson([roomCategoryStat]);
				break;
			case PriceProductPriceType.SinglePrice:
				priceProduct.price = DefaultPriceProductBuilder.getPricePerRoomCategory(roomCategoryStat);
				break;
		}

		priceProduct.roomCategoryIdList = [roomCategoryStat.roomCategory.id];
		priceProduct.status = PriceProductStatus.Active;
		priceProduct.taxIdList = [taxId];
		priceProduct.versionId = 0;
		priceProduct.yieldFilterList = [];
		ppUtils.populateDefaultValuesOn(priceProduct);
		return priceProduct;
	}

	public static getPricePerPerson(roomCategoryStatList: RoomCategoryStatsDO[]): PriceProductPriceDO {
		var outPrice = new PriceProductPriceDO();
		outPrice.type = PriceProductPriceType.PricePerPerson;

		let dynamicPrice = DefaultPriceProductBuilder.getPricePerPersonDynamicPriceDO(roomCategoryStatList, "Default Rate", "test");
		let timestamp = ThTimestampDO.buildThTimestampForTimezone(DefaultHotelBuilder.Timezone);
		let priceException = new PriceExceptionDO();
		priceException.dayFromWeek = timestamp.thDateDO.getISOWeekDay();
		priceException.price = dynamicPrice.priceList[0];
		dynamicPrice.priceExceptionList = [priceException];

		let dynamicPrice2 = DefaultPriceProductBuilder.getPricePerPersonDynamicPriceDO(roomCategoryStatList, "High Season Rate", "test2");
		let dynamicPrice3 = DefaultPriceProductBuilder.getPricePerPersonDynamicPriceDO(roomCategoryStatList, "Low Season Rate", "test3");

		outPrice.dynamicPriceList = [dynamicPrice, dynamicPrice2, dynamicPrice3];
		outPrice.enabledDynamicPriceIdByDate = {};
		return outPrice;
	}
	private static getPricePerPersonDynamicPriceDO(roomCategoryStatList: RoomCategoryStatsDO[], name: string, dpId: string): DynamicPriceDO {
		let dynamicPrice = new DynamicPriceDO(PriceProductPriceType.PricePerPerson);
		dynamicPrice.id = dpId;
		dynamicPrice.name = name;
		dynamicPrice.description = "Some description for " + name;

		dynamicPrice.priceList = [];
		_.forEach(roomCategoryStatList, (roomCategoryStat: RoomCategoryStatsDO) => {
			var pricePerPerson = new PricePerPersonDO();
			pricePerPerson.roomCategoryId = roomCategoryStat.roomCategory.id;
			pricePerPerson.adultsPriceList = DefaultPriceProductBuilder.getPriceForFixedNumberOfPersonsDOList(roomCategoryStat.capacity.totalCapacity.noAdults);
			pricePerPerson.childrenPriceList = DefaultPriceProductBuilder.getPriceForFixedNumberOfPersonsDOList(roomCategoryStat.capacity.totalCapacity.noChildren + roomCategoryStat.capacity.totalCapacity.noAdults);
			pricePerPerson.firstChildWithoutAdultPrice = 50.0;
			pricePerPerson.firstChildWithAdultInSharedBedPrice = 10.0;

			dynamicPrice.priceList.push(pricePerPerson);
		});
		dynamicPrice.priceExceptionList = [];
		return dynamicPrice;
	}

	private static getPriceForFixedNumberOfPersonsDOList(maxNoOfPersons: number): PriceForFixedNumberOfPersonsDO[] {
		var testUtils = new TestUtils();
		var priceList: PriceForFixedNumberOfPersonsDO[] = [];
		for (var noOfPersons = 1; noOfPersons <= maxNoOfPersons; noOfPersons++) {
			var price = new PriceForFixedNumberOfPersonsDO();
			price.buildFromObject({
				noOfPersons: noOfPersons,
				price: testUtils.getRandomFloatBetween(50, 100)
			});
			priceList.push(price);
		}
		return priceList;
	}

	public static getPricePerRoomCategory(roomCategoryStat: RoomCategoryStatsDO): PriceProductPriceDO {
		var outPrice = new PriceProductPriceDO();
		outPrice.type = PriceProductPriceType.SinglePrice;

		let dynamicPrice = new DynamicPriceDO(outPrice.type);
		dynamicPrice.id = "test";
		dynamicPrice.name = "Default Rate";
		dynamicPrice.description = "";

		var singlePrice = new SinglePriceDO();
		singlePrice.price = 98.21;
		singlePrice.roomCategoryId = roomCategoryStat.roomCategory.id;
		dynamicPrice.priceList = [singlePrice];

		let timestamp = ThTimestampDO.buildThTimestampForTimezone(DefaultHotelBuilder.Timezone);
		let priceException = new PriceExceptionDO();
		priceException.dayFromWeek = timestamp.thDateDO.getISOWeekDay();
		priceException.price = dynamicPrice.priceList[0];
		dynamicPrice.priceExceptionList = [priceException];

		outPrice.dynamicPriceList = [dynamicPrice];
		outPrice.enabledDynamicPriceIdByDate = {};
		return outPrice;
	}

	public loadPriceProducts(dataSource: IPriceProductDataSource, roomCategoryStatsList: RoomCategoryStatsDO[],
		taxes: TaxResponseRepoDO, addOnProductList: AddOnProductDO[], breakfastAopCategoryId: string): Promise<PriceProductDO[]> {
		return new Promise<PriceProductDO[]>((resolve: { (result: PriceProductDO[]): void }, reject: { (err: ThError): void }) => {
			this.loadPriceProductsCore(resolve, reject, dataSource, roomCategoryStatsList, taxes, addOnProductList, breakfastAopCategoryId);
		});
	}
	private loadPriceProductsCore(resolve: { (result: PriceProductDO[]): void }, reject: { (err: ThError): void },
		dataSource: IPriceProductDataSource, roomCategoryStatsList: RoomCategoryStatsDO[],
		taxes: TaxResponseRepoDO, addOnProductList: AddOnProductDO[], breakfastAopCategoryId: string) {

		var priceProductList: PriceProductDO[] = dataSource.getPriceProductList(roomCategoryStatsList, taxes, addOnProductList, breakfastAopCategoryId);
		var priceProductRepository = this._testContext.appContext.getRepositoryFactory().getPriceProductRepository();

		var ppPromiseList: Promise<PriceProductDO>[] = [];
		priceProductList.forEach((priceProduct: PriceProductDO) => {
			ppPromiseList.push(priceProductRepository.addPriceProduct({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, priceProduct));
		});
		Promise.all(ppPromiseList).then((priceProductList: PriceProductDO[]) => {
			resolve(priceProductList);
		}).catch((error: any) => {
			reject(error);
		});
	}
}