import {DefaultBillingDetailsDO} from '../../../data-layer/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import {BookingValidationStructures} from '../utils/BookingValidationStructures';
import {InvoicePaymentMethodType} from '../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {ArrayValidationStructure} from '../../../utils/th-validation/structure/ArrayValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {EmailValidationRule} from '../../../utils/th-validation/rules/EmailValidationRule';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {BooleanValidationRule} from '../../../utils/th-validation/rules/BooleanValidationRule';
import {NumberInListValidationRule} from '../../../utils/th-validation/rules/NumberInListValidationRule';

export class BookingItemDO {
    customerIdList: string[];
    defaultBillingDetails: DefaultBillingDetailsDO;
    roomCategoryId: string;
    priceProductId: string;
    allotmentId: string;
    notes: string;
}

export class AddBookingItemsDO {
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
    bookingList: BookingItemDO[];
    confirmationEmailList: string[];

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "interval",
                validationStruct: BookingValidationStructures.getThDateIntervalDOValidationStructure()
            },
            {
                key: "configCapacity",
                validationStruct: BookingValidationStructures.getConfigCapacityDOValidationStructure()
            },
            {
                key: "bookingList",
                validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
                    {
                        key: "customerIdList",
                        validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new StringValidationRule()))
                    },
                    {
                        key: "defaultBillingDetails",
                        validationStruct: new ObjectValidationStructure([
                            {
                                key: "customerId",
                                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                            },
                            {
                                key: "paymentGuarantee",
                                validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
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
                        ])
                    },
                    {
                        key: "roomCategoryId",
                        validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                    },
                    {
                        key: "priceProductId",
                        validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                    },
                    {
                        key: "allotmentId",
                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                    },
                    {
                        key: "notes",
                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                    }
                ]))
            },
            {
                key: "confirmationEmailList",
                validationStruct: new ArrayValidationStructure(new PrimitiveValidationStructure(new EmailValidationRule()))
            }
        ]);
    }
}