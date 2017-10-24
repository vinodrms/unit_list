import { IValidationStructure } from '../../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { ArrayValidationStructure } from '../../../../utils/th-validation/structure/ArrayValidationStructure';
import { StringValidationRule } from '../../../../utils/th-validation/rules/StringValidationRule';
import { AddOnProductBookingReservedItem } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { NumberValidationRule } from "../../../../utils/th-validation/rules/NumberValidationRule";

export class BookingReserveAddOnProductsDO {
    groupBookingId: string;
    id: string;
    reservedAddOnProductList: AddOnProductBookingReservedItem[];

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "groupBookingId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "reservedAddOnProductList",
                validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
                    {
                        key: "aopSnapshot",
                        validationStruct: new ObjectValidationStructure([
                            {
                                key: "id",
                                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                            },
                            {
                                key: "categoryId",
                                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                            },
                            {
                                key: "name",
                                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                            },
                            {
                                key: "price",
                                validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
                            },
                            {
                                key: "taxIdList",
                                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
                            },
                        ])
                    },
                    {
                        key: "noOfItems",
                        validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
                    }
                ]))
            }
        ]);
    }
}