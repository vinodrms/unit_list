import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';
import {TestContext} from '../../../../helpers/TestContext';
import {TestUtils} from '../../../../helpers/TestUtils';
import {SavePriceProductItemDO} from '../../../../../core/domain-layer/price-products/SavePriceProductItemDO';
import {SavePriceProductItemPriceDO} from '../../../../../core/domain-layer/price-products/validation-structures/SavePriceProductItemPriceDO';
import {PriceProductStatus, PriceProductAvailability} from '../../../../../core/data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductPriceType} from '../../../../../core/data-layer/price-products/data-objects/price/IPriceProductPrice';
import {PriceProductCancellationPolicyType} from '../../../../../core/data-layer/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import {PriceProductCancellationPenaltyType} from '../../../../../core/data-layer/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import {RoomAggregator} from '../../../../../core/domain-layer/rooms/aggregators/RoomAggregator';
import {RoomCategoryStatsDO} from '../../../../../core/data-layer/room-categories/data-objects/RoomCategoryStatsDO';
import {PriceForFixedNumberOfPersonsDO} from '../../../../../core/data-layer/price-products/data-objects/price/price-per-person/PriceForFixedNumberOfPersonsDO';
import {PricePerRoomCategoryDO} from '../../../../../core/data-layer/price-products/data-objects/price/price-per-room-category/PricePerRoomCategoryDO';
import {PriceProductConstraintType} from '../../../../../core/data-layer/price-products/data-objects/constraint/IPriceProductConstraint';
import {ISOWeekDay} from '../../../../../core/utils/th-dates/data-objects/ISOWeekDay';

export class PriceProductsHelper {
	private static RoomIndex = 0;
	private _testUtils: TestUtils;
	private _roomCategoryStat: RoomCategoryStatsDO;

	constructor(private _dataBuilder: DefaultDataBuilder, private _testContext: TestContext) {
		this._testUtils = new TestUtils();
	}

	public indexRoomCategory(): Promise<RoomCategoryStatsDO[]> {
		var aggregator = new RoomAggregator(this._testContext.appContext);
		return aggregator.getRoomCategoryStatsList({ hotelId: this._testContext.sessionContext.sessionDO.hotel.id }, [this.getRoomCategoryId()]);
	}

	public getDraftSavePriceProductItemDO(): SavePriceProductItemDO {
		return {
			status: PriceProductStatus.Draft,
			name: "Test Price Product",
			availability: PriceProductAvailability.Public,
			lastRoomAvailability: false,
			addOnProductIdList: [this._testUtils.getRandomListElement(this._dataBuilder.addOnProductList).id],
			roomCategoryIdList: [this.getRoomCategoryId()],
			price: this.getPricePerPerson(),
			taxIdList: [this._testUtils.getRandomListElement(this._dataBuilder.taxes.vatList).id],
			yieldFilterList: [],
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
		return this._dataBuilder.roomList[PriceProductsHelper.RoomIndex].categoryId;
	}
	public getPricePerPerson(): SavePriceProductItemPriceDO {
		return {
			type: PriceProductPriceType.PricePerPerson,
			priceConfiguration: {
				defaultPrice: 100.5,
				adultsPriceList: this.getPriceForFixedNumberOfPersonsDOList(this._roomCategoryStat.maxNoAdults),
				chldrenPriceList: this.getPriceForFixedNumberOfPersonsDOList(this._roomCategoryStat.maxNoChildren)
			}
		}
	}
	private getPriceForFixedNumberOfPersonsDOList(maxNoOfPersons: number): PriceForFixedNumberOfPersonsDO[] {
		var priceList: PriceForFixedNumberOfPersonsDO[] = [];
		for (var noOfPersons = 1; noOfPersons <= maxNoOfPersons; noOfPersons++) {
			var price = new PriceForFixedNumberOfPersonsDO();
			price.buildFromObject({
				noOfPersons: noOfPersons,
				price: this._testUtils.getRandomFloatBetween(50, 100)
			});
			priceList.push(price);
		}
		return priceList;
	}
	public getPricePerRoomCategory(): SavePriceProductItemPriceDO {
		var priceConfiguration = new PricePerRoomCategoryDO();
		priceConfiguration.buildFromObject({
			priceList: [
				{
					roomCategoryId: this.getRoomCategoryId,
					price: 98.21
				}
			]
		})
		return {
			type: PriceProductPriceType.PricePerRoomCategory,
			priceConfiguration: priceConfiguration
		};
	}


	public get roomCategoryStat(): RoomCategoryStatsDO {
		return this._roomCategoryStat;
	}
	public set roomCategoryStat(roomStat: RoomCategoryStatsDO) {
		this._roomCategoryStat = roomStat;
	}

}