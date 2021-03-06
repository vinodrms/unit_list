import { PriceProductPriceType } from '../../../data-layer/price-products/data-objects/price/IPriceProductPrice';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { ArrayValidationStructure } from '../../../utils/th-validation/structure/ArrayValidationStructure';
import { StringValidationRule } from '../../../utils/th-validation/rules/StringValidationRule';
import { NumberValidationRule } from '../../../utils/th-validation/rules/NumberValidationRule';

export interface SavePriceProductItemDynamicPriceDO {
	id?: string;
	name: string;
	description: string;
	priceList: Object[];
	priceExceptionList: Object[];
}

export class SavePriceProductItemPriceDO {
	type: PriceProductPriceType;
	dynamicPriceList: SavePriceProductItemDynamicPriceDO[];

	public static getPriceListValidationStructure(priceDO: SavePriceProductItemPriceDO): IValidationStructure {
		return new ArrayValidationStructure(
			SavePriceProductItemPriceDO.getPriceConfigurationValidationStructure(priceDO)
		);
	}
	public static getPriceExceptionListValidationStructure(priceDO: SavePriceProductItemPriceDO): IValidationStructure {
		return new ArrayValidationStructure(
			new ObjectValidationStructure([
				{
					key: "price",
					validationStruct: SavePriceProductItemPriceDO.getPriceConfigurationValidationStructure(priceDO)
				}
			])
		);
	}
	private static getPriceConfigurationValidationStructure(priceDO: SavePriceProductItemPriceDO): IValidationStructure {
		switch (priceDO.type) {
			case PriceProductPriceType.PricePerPerson:
				return new ObjectValidationStructure([
					{
						key: "roomCategoryId",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
					},
					{
						key: "adultsPriceList",
						validationStruct: SavePriceProductItemPriceDO.getPriceForFixedNumberOfPersonsDOValidationStructure()
					},
					{
						key: "childrenPriceList",
						validationStruct: SavePriceProductItemPriceDO.getPriceForFixedNumberOfPersonsDOValidationStructure()
					},
					{
						key: "firstChildWithoutAdultPrice",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
					},
					{
						key: "firstChildWithAdultInSharedBedPrice",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
					}
				]);
			case PriceProductPriceType.SinglePrice:
				return new ObjectValidationStructure([
					{
						key: "roomCategoryId",
						validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
					},
					{
						key: "price",
						validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
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