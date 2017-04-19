import { DefaultDataBuilder } from '../../../../db-initializers/DefaultDataBuilder';
import { TestContext } from '../../../../helpers/TestContext';
import { TestUtils } from '../../../../helpers/TestUtils';
import { DefaultPriceProductBuilder } from '../../../../db-initializers/builders/DefaultPriceProductBuilder';
import { SavePriceProductItemDO } from '../../../../../core/domain-layer/price-products/SavePriceProductItemDO';
import { SavePriceProductItemPriceDO } from '../../../../../core/domain-layer/price-products/validation-structures/SavePriceProductItemPriceDO';
import { PriceProductStatus, PriceProductAvailability } from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductYieldFilterMetaDO } from '../../../../../core/data-layer/price-products/data-objects/yield-filter/PriceProductYieldFilterDO';
import { PriceProductPriceType } from '../../../../../core/data-layer/price-products/data-objects/price/IPriceProductPrice';
import { PriceProductCancellationPolicyType } from '../../../../../core/data-layer/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import { PriceProductCancellationPenaltyType } from '../../../../../core/data-layer/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import { PriceProductIncludedItemsDO } from '../../../../../core/data-layer/price-products/data-objects/included-items/PriceProductIncludedItemsDO';
import { AttachedAddOnProductItemDO } from '../../../../../core/data-layer/price-products/data-objects/included-items/AttachedAddOnProductItemDO';
import { AttachedAddOnProductItemStrategyType } from '../../../../../core/data-layer/price-products/data-objects/included-items/IAttachedAddOnProductItemStrategy';
import { OneItemPerDayAttachedAddOnProductItemStrategyDO } from '../../../../../core/data-layer/price-products/data-objects/included-items/strategies/OneItemPerDayAttachedAddOnProductItemStrategyDO';
import { AddOnProductDO } from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductDO';
import { AddOnProductSnapshotDO } from '../../../../../core/data-layer/add-on-products/data-objects/AddOnProductSnapshotDO';
import { YieldFilterDO } from '../../../../../core/data-layer/common/data-objects/yield-filter/YieldFilterDO';
import { RoomCategoryStatsAggregator } from '../../../../../core/domain-layer/room-categories/aggregators/RoomCategoryStatsAggregator';
import { RoomCategoryStatsDO } from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import { PriceProductConstraintType } from '../../../../../core/data-layer/price-products/data-objects/constraint/IPriceProductConstraint';
import { ISOWeekDay } from '../../../../../core/utils/th-dates/data-objects/ISOWeekDay';
import { CustomerDO } from "../../../../../core/data-layer/customers/data-objects/CustomerDO";

import _ = require('underscore');

export class PriceProductsHelper {
	private _testUtils: TestUtils;
	private _roomCategoryStat: RoomCategoryStatsDO;
	private _validPPFilters: PriceProductYieldFilterMetaDO[];

	constructor(private _dataBuilder: DefaultDataBuilder, private _testContext: TestContext) {
		this._testUtils = new TestUtils();
	}

	public updateYMValidFilterList(validFilterList: YieldFilterDO[]) {
		var filter = this._testUtils.getRandomListElement(validFilterList);
		var filterValue = this._testUtils.getRandomListElement(filter.values);

		var validFilter = new PriceProductYieldFilterMetaDO();
		validFilter.filterId = filter.id;
		validFilter.valueId = filterValue.id;
		this._validPPFilters = [validFilter];
	}

	public getInvalidFilterList(): PriceProductYieldFilterMetaDO[] {
		var filter = new PriceProductYieldFilterMetaDO();
		filter.filterId = "123456";
		filter.valueId = "123456";
		return [filter];
	}

	public getDraftSavePriceProductItemDO(customerList?: CustomerDO[]): SavePriceProductItemDO {
		this.ensureRoomCategoryStatWasSet();

		var includedItems = new PriceProductIncludedItemsDO();

		var breakfastAopCategoryId = this._dataBuilder.breakfastAddOnProductCategory.id;
		var breakfastAddOnProduct = _.find(this._dataBuilder.addOnProductList, (aop: AddOnProductDO) => {
			return aop.categoryId === breakfastAopCategoryId;
		});
		var addOnProduct = _.find(this._dataBuilder.addOnProductList, (aop: AddOnProductDO) => {
			return aop.categoryId !== breakfastAopCategoryId;
		});
		var attachedAopItem = new AttachedAddOnProductItemDO();
		attachedAopItem.addOnProductSnapshot = new AddOnProductSnapshotDO();
		attachedAopItem.addOnProductSnapshot.id = addOnProduct.id;
		attachedAopItem.strategyType = AttachedAddOnProductItemStrategyType.OneItemPerDayForEachAdultOrChild;
		attachedAopItem.strategy = new OneItemPerDayAttachedAddOnProductItemStrategyDO();
		includedItems.attachedAddOnProductItemList = [
			attachedAopItem
		];

		includedItems.includedBreakfastAddOnProductSnapshot = new AddOnProductSnapshotDO();
		includedItems.includedBreakfastAddOnProductSnapshot.id = breakfastAddOnProduct.id;
		includedItems.indexedAddOnProductIdList = [
			breakfastAddOnProduct.id,
			addOnProduct.id
		];
		let discountCustomerIdList = [];
		if (_.isArray(customerList)) {
			discountCustomerIdList.push(this._testUtils.getRandomListElement(customerList).id);
		}

		return {
			status: PriceProductStatus.Draft,
			parentId: null,
			name: "Test Price Product",
			availability: PriceProductAvailability.Public,
			lastRoomAvailability: false,
			includedItems: includedItems,
			roomCategoryIdList: [this.getRoomCategoryId()],
			price: DefaultPriceProductBuilder.getPricePerPerson([this._roomCategoryStat]),
			taxIdList: [this._testUtils.getRandomListElement(this._dataBuilder.taxes.vatList).id],
			yieldFilterList: this._validPPFilters,
			constraints: {
				constraintList: [
					{
						type: PriceProductConstraintType.BookableOnlyOnDaysFromWeek,
						constraint: {
							daysFromWeek: [ISOWeekDay.Monday, ISOWeekDay.Tuesday]
						}
					},
					{
						type: PriceProductConstraintType.IncludeDaysFromWeek,
						constraint: {
							daysFromWeek: [ISOWeekDay.Monday, ISOWeekDay.Tuesday]
						}
					},
					{
						type: PriceProductConstraintType.MaximumLeadDays,
						constraint: {
							leadDays: 30
						}
					},
					{
						type: PriceProductConstraintType.MinimumLeadDays,
						constraint: {
							leadDays: 10
						}
					},
					{
						type: PriceProductConstraintType.MinimumLengthOfStay,
						constraint: {
							lengthOfStay: 3
						}
					},
					{
						type: PriceProductConstraintType.MinimumNumberOfRooms,
						constraint: {
							noOfRooms: 1
						}
					},
					{
						type: PriceProductConstraintType.MustArriveOnDaysFromWeek,
						constraint: {
							daysFromWeek: [ISOWeekDay.Monday]
						}
					},
					{
						type: PriceProductConstraintType.MinimumNumberOfAdults,
						constraint: {
							noOfAdults: 1
						}
					}
				]
			},
			discounts: {
				discountList: [
					{
						name: "Discount 1",
						value: 0.1,
						constraints: {
							constraintList: [
								{
									type: PriceProductConstraintType.MinimumLeadDays,
									constraint: {
										leadDays: 0
									}
								},
								{
									type: PriceProductConstraintType.MinimumNumberOfAdults,
									constraint: {
										noOfAdults: 1
									}
								}
							]
						},
						intervals: {
							intervalList: []
						},
						customerIdList: discountCustomerIdList
					},
					{
						name: "Discount 2",
						value: 0.08,
						constraints: {
							constraintList: [
								{
									type: PriceProductConstraintType.MinimumLengthOfStay,
									constraint: {
										lengthOfStay: 7
									}
								}
							]
						},
						intervals: {
							intervalList: []
						},
						customerIdList: discountCustomerIdList
					}
				]
			},
			conditions: {
				policyType: PriceProductCancellationPolicyType.CanCancelDaysBefore,
				policy: {
					daysBefore: 5
				},
				penaltyType: PriceProductCancellationPenaltyType.PercentageFromBooking,
				penalty: {
					percentage: 0.3
				}
			},
			notes: "A nice price product"
		}
	}
	public getRoomCategoryId(): string {
		this.ensureRoomCategoryStatWasSet();
		return this._roomCategoryStat.roomCategory.id;
	}
	public get roomCategoryStat(): RoomCategoryStatsDO {
		this.ensureRoomCategoryStatWasSet();
		return this._roomCategoryStat;
	}
	public set roomCategoryStat(roomCategoryStat: RoomCategoryStatsDO) {
		this._roomCategoryStat = roomCategoryStat;
	}
	private ensureRoomCategoryStatWasSet() {
		if (!this._roomCategoryStat) {
			this._roomCategoryStat = this._testUtils.getRandomListElement(this._dataBuilder.roomCategoryStatsList);
		}
	}
}