import {ThDateIntervalDO} from '../../utils/th-dates/data-objects/ThDateIntervalDO';
import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../utils/th-validation/structure/ArrayValidationStructure';
import {NumberValidationRule} from '../../utils/th-validation/rules/NumberValidationRule';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {ISOWeekDayUtils} from '../../utils/th-dates/data-objects/ISOWeekDay';
import {NumberInListValidationRule} from '../../utils/th-validation/rules/NumberInListValidationRule';
import {AllotmentStatus} from '../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentAvailabilityDO} from '../../data-layer/allotments/data-objects/availability/AllotmentAvailabilityDO';
import {AllotmentConstraintType} from '../../data-layer/allotments/data-objects/constraint/IAllotmentConstraint';
import {AllotmentConstraintWrapperDO} from '../../data-layer/allotments/data-objects/constraint/AllotmentConstraintWrapperDO';

export class SaveAllotmentItemDO {
	status: AllotmentStatus;
	customerId: string;
	priceProductId: string;
	roomCategoryId: string;
	openInterval: ThDateIntervalDO;
	availability: AllotmentAvailabilityDO;
	constraints: AllotmentConstraintWrapperDO;
	notes: string;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "id",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
			},
			{
				key: "status",
				validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([AllotmentStatus.Active, AllotmentStatus.Archived]))
			},
			{
				key: "customerId",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "priceProductId",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "roomCategoryId",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "openInterval",
				validationStruct: new ObjectValidationStructure([
					{
						key: "start",
						validationStruct: SaveAllotmentItemDO.getThDateDOValidationStructure()
					},
					{
						key: "end",
						validationStruct: SaveAllotmentItemDO.getThDateDOValidationStructure()
					}
				])
			},
			{
				key: "availability",
				validationStruct: new ObjectValidationStructure([
					{
						key: "availabilityForDayList",
						validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
							{
								key: "isoWeekDay",
								validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule((new ISOWeekDayUtils()).getISOWeekDayList()))
							},
							{
								key: "availableCount",
								validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
							}
						]))
					}
				])
			},
			{
				key: "constraints",
				validationStruct: new ObjectValidationStructure([
					{
						key: "constraintList",
						validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
							{
								key: "type",
								validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([AllotmentConstraintType.BookableOnlyOnDaysFromWeek, AllotmentConstraintType.IncludeDaysFromWeek, AllotmentConstraintType.ReleaseTimeInDays]))
							},
							{
								key: "constraint",
								validationStruct: new ObjectValidationStructure([])
							}
						]))
					}
				])
			},
			{
				key: "notes",
				validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(2000))
			}
		]);
	}

	private static getThDateDOValidationStructure(): IValidationStructure {
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
	public static getConstraintValidationStructure(constraintType: AllotmentConstraintType): IValidationStructure {
		switch (constraintType) {
			case AllotmentConstraintType.BookableOnlyOnDaysFromWeek:
				return SaveAllotmentItemDO.getDaysFromWeekValidationStructure()
			case AllotmentConstraintType.IncludeDaysFromWeek:
				return SaveAllotmentItemDO.getDaysFromWeekValidationStructure()
			case AllotmentConstraintType.ReleaseTimeInDays:
				return SaveAllotmentItemDO.getNoOfDaysValidationStructure();
		}
	}
	private static getDaysFromWeekValidationStructure(): IValidationStructure {
		var weekDayUtils = new ISOWeekDayUtils();
		return new ObjectValidationStructure([
			{
				key: "daysFromWeek",
				validationStruct: new ArrayValidationStructure(
					new PrimitiveValidationStructure(new NumberInListValidationRule(weekDayUtils.getISOWeekDayList()))
				)
			}
		]);
	}
	private static getNoOfDaysValidationStructure(): IValidationStructure {
		var weekDayUtils = new ISOWeekDayUtils();
		return new ObjectValidationStructure([
			{
				key: "noOfDays",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
			}
		]);
	}
}