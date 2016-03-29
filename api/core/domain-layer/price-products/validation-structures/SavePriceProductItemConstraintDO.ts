import {PriceProductConstraintType} from '../../../data-layer/price-products/data-objects/constraint/IPriceProductConstraint';
import {ISOWeekDayUtils} from '../../../utils/th-dates/data-objects/ISOWeekDay';
import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../../utils/th-validation/structure/ArrayValidationStructure';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';
import {NumberInListValidationRule} from '../../../utils/th-validation/rules/NumberInListValidationRule';

export class SavePriceProductItemConstraintDO {
	type: PriceProductConstraintType;
	constraint: Object;

	public static getConstraintValidationStructure(constraintDO: SavePriceProductItemConstraintDO): IValidationStructure {
		switch (constraintDO.type) {
			case PriceProductConstraintType.BookableOnlyOnDaysFromWeek:
				return SavePriceProductItemConstraintDO.getDaysFromWeekValidationStructure()
			case PriceProductConstraintType.IncludeDaysFromWeek:
				return SavePriceProductItemConstraintDO.getDaysFromWeekValidationStructure()
			case PriceProductConstraintType.MaximumLeadDays:
				return SavePriceProductItemConstraintDO.getLeadDaysValidationStructure();
			case PriceProductConstraintType.MinimumLeadDays:
				return SavePriceProductItemConstraintDO.getLeadDaysValidationStructure();
			case PriceProductConstraintType.MinimumLengthOfStay:
				return SavePriceProductItemConstraintDO.getMinLengthOfStayValidationStructure();
			case PriceProductConstraintType.MinimumNumberOfRooms:
				return SavePriceProductItemConstraintDO.getMinNoOfRoomsValidationStructure();
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

	private static getLeadDaysValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "leadDays",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
			}
		]);
	}

	private static getMinLengthOfStayValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "minLengthOfStay",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
			}
		]);
	}

	private static getMinNoOfRoomsValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "noOfRooms",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
			}
		]);
	}
}