import { AddOnProductDO } from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";
import { BooleanValidationRule } from "../../../utils/th-validation/rules/BooleanValidationRule";

export interface GenerateBookingInvoiceAopMeta {
	addOnProductDO: AddOnProductDO;
	noOfItems: number;
}

export class GenerateBookingInvoiceDO {
	groupBookingId: string;
	bookingId: string;
	attachReservedAddOnProductsFromBooking: boolean;

	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "groupBookingId",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "bookingId",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			},
			{
				key: "attachReservedAddOnProductsFromBooking",
				validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
			}
		]);
	}
}