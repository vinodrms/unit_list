import {PriceProductPriceType} from '../../../data-layer/price-products/data-objects/price/IPriceProductPrice';
import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';

export class SavePriceProductItemPriceDO {
	type: PriceProductPriceType;
	priceConfiguration: Object;

	public static getPriceConfigurationValidationStructure(priceDO: SavePriceProductItemPriceDO): IValidationStructure {
		switch (priceDO.type) {
			case PriceProductPriceType.PricePerPerson:
				return new ObjectValidationStructure([
					{
						key: "defaultPrice",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
					},
					{
						key: "adultsPriceList",
						validationStruct: SavePriceProductItemPriceDO.getPriceForFixedNumberOfPersonsDOValidationStructure()
					},
					{
						key: "childrenPriceList",
						validationStruct: SavePriceProductItemPriceDO.getPriceForFixedNumberOfPersonsDOValidationStructure()
					}
				]);
			case PriceProductPriceType.PricePerRoomCategory:
				return new ObjectValidationStructure([
					{
						key: "priceList",
						validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
							{
								key: "roomCategoryId",
								validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
							},
							{
								key: "price",
								validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
							}
						]))
					}
				]);
		}
	}
	private static getPriceForFixedNumberOfPersonsDOValidationStructure(): IValidationStructure {
		return new ArrayValidationStructure(new ObjectValidationStructure([
			{
				key: "noOfPersons",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildIntegerNumberRule(0))
			},
			{
				key: "price",
				validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
			}
		]))
	}
}