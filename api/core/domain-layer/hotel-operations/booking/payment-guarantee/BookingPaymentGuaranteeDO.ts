import {IValidationStructure} from '../../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../../utils/th-validation/rules/StringValidationRule';
import {NumberInListValidationRule} from '../../../../utils/th-validation/rules/NumberInListValidationRule';
import {InvoicePaymentMethodDO, InvoicePaymentMethodType} from '../../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';

export class BookingPaymentGuaranteeDO {
    groupBookingId: string;
    id: string;
    billedCustomerId: string;
    paymentMethod: InvoicePaymentMethodDO;

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
                key: "billedCustomerId",
                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
            },
            {
                key: "paymentMethod",
                validationStruct: new ObjectValidationStructure([
                    {
                        key: "type",
                        validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([InvoicePaymentMethodType.DefaultPaymentMethod, InvoicePaymentMethodType.PayInvoiceByAgreement]))
                    },
                    {
                        key: "value",
                        validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                    }
                ])
            }
        ]);
    }
}