import { PriceProductStatus, PriceProductAvailability } from '../../data-layer/price-products/data-objects/PriceProductDO';
import { PriceProductPriceType } from '../../data-layer/price-products/data-objects/price/IPriceProductPrice';
import { PriceProductYieldFilterMetaDO } from '../../data-layer/price-products/data-objects/yield-filter/PriceProductYieldFilterDO';
import { PriceProductConstraintType } from '../../data-layer/price-products/data-objects/constraint/IPriceProductConstraint';
import { PriceProductCancellationPolicyType } from '../../data-layer/price-products/data-objects/conditions/cancellation/IPriceProductCancellationPolicy';
import { PriceProductCancellationPenaltyType } from '../../data-layer/price-products/data-objects/conditions/penalty/IPriceProductCancellationPenalty';
import { PriceProductIncludedItemsDO } from '../../data-layer/price-products/data-objects/included-items/PriceProductIncludedItemsDO';
import { AttachedAddOnProductItemStrategyType } from '../../data-layer/price-products/data-objects/included-items/IAttachedAddOnProductItemStrategy';
import { IValidationStructure } from '../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import { ArrayValidationStructure } from '../../utils/th-validation/structure/ArrayValidationStructure';
import { StringValidationRule } from '../../utils/th-validation/rules/StringValidationRule';
import { NumberInListValidationRule } from '../../utils/th-validation/rules/NumberInListValidationRule';
import { NumberValidationRule } from '../../utils/th-validation/rules/NumberValidationRule';
import { BooleanValidationRule } from '../../utils/th-validation/rules/BooleanValidationRule';
import { SavePriceProductItemPriceDO } from './validation-structures/SavePriceProductItemPriceDO';
import { SavePriceProductItemConstraintDO } from './validation-structures/SavePriceProductItemConstraintDO';
import { ISOWeekDayUtils } from '../../utils/th-dates/data-objects/ISOWeekDay';
import { ThDateIntervalDO } from "../../utils/th-dates/data-objects/ThDateIntervalDO";

export interface SavePriceProductItemConstraintListDO {
	constraintList: SavePriceProductItemConstraintDO[];
}

export interface SavePriceProductItemDiscountDO {
	name: string;
	value: number;
	constraints: SavePriceProductItemConstraintListDO;
	intervals: ThDateIntervalDO[];
	customerIdList: string[];
}

export interface SavePriceProductItemDiscountListDO {
	discountList: SavePriceProductItemDiscountDO[];
}

export interface SavePriceProductItemConditionsDO {
	policyType: PriceProductCancellationPolicyType;
	policy: Object;
	penaltyType: PriceProductCancellationPenaltyType;
	penalty: Object;
}

export class SavePriceProductItemDO {
	status: PriceProductStatus;
	name: string;
	availability: PriceProductAvailability;
	lastRoomAvailability: boolean;
	includedItems: PriceProductIncludedItemsDO;
	roomCategoryIdList: string[];
	price: SavePriceProductItemPriceDO;
	taxIdList: string[];
	yieldFilterList: PriceProductYieldFilterMetaDO[];
	constraints: SavePriceProductItemConstraintListDO;
	conditions: SavePriceProductItemConditionsDO;
	discounts: SavePriceProductItemDiscountListDO;
	notes: string;

	public static MaxConstraints = 20;
	public static MaxDiscounts = 20;
	public static MaxConstraintsForDiscount = 20;
	public static MaxNoDynamicRates = 15;

	public static getPriceProductConstraintWrapperValidationRule(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "constraintList",
				validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
					{
						key: "type",
						validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([
							PriceProductConstraintType.BookableOnlyOnDaysFromWeek, PriceProductConstraintType.IncludeDaysFromWeek,
							PriceProductConstraintType.MaximumLeadDays, PriceProductConstraintType.MinimumLeadDays,
							PriceProductConstraintType.MinimumLengthOfStay, PriceProductConstraintType.MinimumNumberOfRooms,
							PriceProductConstraintType.MustArriveOnDaysFromWeek, PriceProductConstraintType.MinimumNumberOfAdults
						]))
					},
					{
						key: "constraint",
						validationStruct: new ObjectValidationStructure([])
					}
				]))
			}
		]);
	}

	public static getThDateIntervalDOValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "start",
                validationStruct: SavePriceProductItemDO.getThDateDOValidationStructure()
            },
            {
                key: "end",
                validationStruct: SavePriceProductItemDO.getThDateDOValidationStructure()
            }
        ]);
    }

	public static getThDateDOValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "year",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "month",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
            },
            {
                key: "day",
                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(1))
            }
        ]);
    }

	public static getValidationStructure(): IValidationStructure {
		var weekDayUtils = new ISOWeekDayUtils();
		return new ObjectValidationStructure([
			{
				key: "id",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			},
			{
				key: "status",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([PriceProductStatus.Active, PriceProductStatus.Draft]))
			},
			{
				key: "name",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule(200))
			},
			{
				key: "availability",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([PriceProductAvailability.Confidential, PriceProductAvailability.Public]))
			},
			{
				key: "lastRoomAvailability",
				validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
			},
			{
				key: "includedItems",
				validationStruct: new ObjectValidationStructure([
					{
						key: "includedBreakfastAddOnProductSnapshot",
						validationStruct: new ObjectValidationStructure([
							{
								key: "id",
								validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
							}
						])
					},
					{
						key: "attachedAddOnProductItemList",
						validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
							{
								key: "addOnProductSnapshot",
								validationStruct: new ObjectValidationStructure([
									{
										key: "id",
										validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
									}
								])
							},
							{
								key: "strategyType",
								validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([AttachedAddOnProductItemStrategyType.OneItemPerDay,
								AttachedAddOnProductItemStrategyType.OneItemForEachAdultOrChild, AttachedAddOnProductItemStrategyType.OneItemPerDayForEachAdultOrChild,
								AttachedAddOnProductItemStrategyType.FixedNumber]))
							},
							{
								key: "strategy",
								validationStruct: new ObjectValidationStructure([
									{
										key: "noOfItems",
										validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullableIntegerNumberRule())
									}
								])
							}
						]))
					}
				])
			},
			{
				key: "roomCategoryIdList",
				validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
			},
			{
				key: "price",
				validationStruct: new ObjectValidationStructure([
					{
						key: "type",
						validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([PriceProductPriceType.PricePerPerson, PriceProductPriceType.SinglePrice]))
					},
					{
						key: "dynamicPriceList",
						validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
							{
								key: "id",
								validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
							},
							{
								key: "name",
								validationStruct: new PrimitiveValidationStructure(new StringValidationRule(50))
							},
							{
								key: "description",
								validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(200))
							},
							{
								key: "priceList",
								validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([]))
							},
							{
								key: "priceExceptionList",
								validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
									{
										key: "dayFromWeek",
										validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule(weekDayUtils.getISOWeekDayList()))
									},
									{
										key: "price",
										validationStruct: new ObjectValidationStructure([])
									}
								]))
							}
						]))
					}
				])
			},
			{
				key: "taxIdList",
				validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
			},
			{
				key: "yieldFilterList",
				validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
					{
						key: "filterId",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
					},
					{
						key: "valueId",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
					}
				]))
			},
			{
				key: "constraints",
				validationStruct: SavePriceProductItemDO.getPriceProductConstraintWrapperValidationRule()
			},
			{
				key: "discounts",
				validationStruct: new ObjectValidationStructure([
					{
						key: "discountList",
						validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
							{
								key: "name",
								validationStruct: new PrimitiveValidationStructure(new StringValidationRule(100))
							},
							{
								key: "value",
								validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPercentageNumberRule())
							},
							{
								key: "constraints",
								validationStruct: SavePriceProductItemDO.getPriceProductConstraintWrapperValidationRule()
							},
							{
								key: "intervals",
								validationStruct: new ArrayValidationStructure(SavePriceProductItemDO.getThDateIntervalDOValidationStructure())
							},
							{
								key: "customerIdList",
								validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
							}
						]))
					}
				])
			},
			{
				key: "conditions",
				validationStruct: new ObjectValidationStructure([
					{
						key: "policyType",
						validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule(
							[
								PriceProductCancellationPolicyType.CanCancelBeforeTimeOnDayOfArrival, PriceProductCancellationPolicyType.CanCancelDaysBefore,
								PriceProductCancellationPolicyType.NoCancellationPossible, PriceProductCancellationPolicyType.NoPolicy
							]))
					},
					{
						key: "policy",
						validationStruct: new ObjectValidationStructure([])
					},
					{
						key: "penaltyType",
						validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule(
							[
								PriceProductCancellationPenaltyType.FirstNightOnly, PriceProductCancellationPenaltyType.FullStay,
								PriceProductCancellationPenaltyType.NoPenalty, PriceProductCancellationPenaltyType.PercentageFromBooking
							]))
					},
					{
						key: "penalty",
						validationStruct: new ObjectValidationStructure([])
					}
				])
			},
			{
				key: "notes",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			}
		]);
	}
}