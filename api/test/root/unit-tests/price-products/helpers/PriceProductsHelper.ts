import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {TestUtils} from '../../../../helpers/TestUtils';
import {DefaultPriceProductBuilder} from '../../../../db-initializers/builders/DefaultPriceProductBuilder';
import {SavePriceProductItemDO} from '../../../../../core/domain-layer/price-products/SavePriceProductItemDO';
import {SavePriceProductItemPriceDO} from '../../../../../core/domain-layer/price-products/validation-structures/SavePriceProductItemPriceDO';
import {PriceProductStatus, PriceProductAvailability} from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductYieldFilterMetaDO} from '../../../../../core/data-layer/price-products/data-objects/yield-filter/PriceProductYieldFilterDO';
import {PriceProductPriceType} from '../../../../../core/data-layer/price-products/data-objects/price/IPriceProductPrice';
import {PriceProductCancellationPolicyType} from '../../../../../core/data-layer/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import {PriceProductCancellationPenaltyType} from '../../../../../core/data-layer/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import {YieldFilterDO} from '../../../../../core/data-layer/common/data-objects/yield-filter/YieldFilterDO';
import {RoomAggregator} from '../../../../../core/domain-layer/rooms/aggregators/RoomAggregator';
import {RoomCategoryStatsDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {PriceForFixedNumberOfPersonsDO} from '../../../../../core/data-layer/price-products/data-objects/price/price-per-person/PriceForFixedNumberOfPersonsDO';
import {PricePerRoomCategoryDO} from '../../../../../core/data-layer/price-products/data-objects/price/price-per-room-category/PricePerRoomCategoryDO';
import {PriceProductConstraintType} from '../../../../../core/data-layer/price-products/data-objects/constraint/IPriceProductConstraint';
import {ISOWeekDay} from '../../../../../core/utils/th-dates/data-objects/ISOWeekDay';

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

	public getDraftSavePriceProductItemDO(): SavePriceProductItemDO {
		this.ensureRoomCategoryStatWasSet();

		return {
			status: PriceProductStatus.Draft,
			name: "Test Price Product",
			availability: PriceProductAvailability.Public,
			lastRoomAvailability: false,
			addOnProductIdList: [this._testUtils.getRandomListElement(this._dataBuilder.addOnProductList).id],
			roomCategoryIdList: [this.getRoomCategoryId()],
			price: DefaultPriceProductBuilder.getPricePerPerson(this._roomCategoryStat),
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
							minLengthOfStay: 3
						}
					},
					{
						type: PriceProductConstraintType.MinimumNumberOfRooms,
						constraint: {
							noOfRooms: 1
						}
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
			}
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
	private ensureRoomCategoryStatWasSet() {
		if (!this._roomCategoryStat) {
			this._roomCategoryStat = this._testUtils.getRandomListElement(this._dataBuilder.roomCategoryStatsList);
		}
	}
}