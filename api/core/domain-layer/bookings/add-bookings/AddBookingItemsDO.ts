import { DefaultBillingDetailsDO } from '../../../data-layer/bookings/data-objects/default-billing/DefaultBillingDetailsDO';
import { ThDateIntervalDO } from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import { ConfigCapacityDO } from '../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';
import { BookingValidationStructures } from '../validators/BookingValidationStructures';
import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { ArrayValidationStructure } from '../../../utils/th-validation/structure/ArrayValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { EmailValidationRule } from '../../../utils/th-validation/rules/EmailValidationRule';
import { StringValidationRule } from '../../../utils/th-validation/rules/StringValidationRule';
import { BooleanValidationRule } from '../../../utils/th-validation/rules/BooleanValidationRule';
import { NumberInListValidationRule } from '../../../utils/th-validation/rules/NumberInListValidationRule';
import { CommonValidationStructures } from "../../common/CommonValidations";
import { BookingDO, TravelActivityType, TravelType } from "../../../data-layer/bookings/data-objects/BookingDO";
import { EmailDistributionDO } from "../../hotel-operations/common/email-confirmations/utils/data-objects/EmailDistributionDO";
import { NumberValidationRule } from "../../../utils/th-validation/rules/NumberValidationRule";
import { InvoicePaymentMethodType } from '../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO';

export class BookingItemDO {
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
    customerIdList: string[];
    defaultBillingDetails: DefaultBillingDetailsDO;
    roomCategoryId: string;
    priceProductId: string;
    allotmentId: string;
    externalBookingReference: string;
    notes: string;
    invoiceNotes: string;
    travelActivityType: TravelActivityType;
    travelType: TravelType;
    confirmationNotes: string;

    public static buildFromBookingDO(bookingDO: BookingDO): BookingItemDO {
        let bookingItemDO = new BookingItemDO();
        bookingItemDO.interval = bookingDO.interval;
        bookingItemDO.customerIdList = bookingDO.customerIdList;
        bookingItemDO.configCapacity = bookingDO.configCapacity;
        bookingItemDO.defaultBillingDetails = bookingDO.defaultBillingDetails;
        bookingItemDO.roomCategoryId = bookingDO.roomCategoryId;
        bookingItemDO.priceProductId = bookingDO.priceProductId;
        bookingItemDO.allotmentId = bookingDO.allotmentId;
        bookingItemDO.externalBookingReference = bookingDO.externalBookingReference;
        bookingItemDO.notes = bookingDO.notes;
        bookingItemDO.invoiceNotes = bookingDO.invoiceNotes;
        bookingItemDO.travelActivityType = bookingDO.travelActivityType;
        bookingItemDO.travelType = bookingDO.travelType;
        bookingItemDO.confirmationNotes = bookingDO.confirmationNotes;
        return bookingItemDO;
    }
}

export class AddBookingItemsDO {
    groupBookingId?: string;
    bookingList: BookingItemDO[];
    confirmationEmailList: EmailDistributionDO[];
    mergeInvoice: boolean;
    confirmationNotes: string;

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "groupBookingId",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "bookingList",
                validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
                    {
                        key: "interval",
                        validationStruct: CommonValidationStructures.getThDateIntervalDOValidationStructure()
                    },
                    {
                        key: "configCapacity",
                        validationStruct: BookingValidationStructures.getConfigCapacityDOValidationStructure()
                    },
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
                        key: "externalBookingReference",
                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                    },
                    {
                        key: "notes",
                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                    },
                    {
                        key: "invoiceNotes",
                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                    },
                    {
                        key: "travelActivityType",
                        validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([TravelActivityType.Business, TravelActivityType.Leisure]))
                    },
                    {
                        key: "travelType",
                        validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([TravelType.Individual, TravelType.Group]))
                    }
                ]))
            },
            {
                key: "confirmationEmailList",
                validationStruct: new ArrayValidationStructure(
                    new ObjectValidationStructure([
                        {
                            key: "email",
                            validationStruct: new PrimitiveValidationStructure(new EmailValidationRule())
                        },
                        {
                            key: "guestName",
                            validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                        }
                    ]))
            },
            {
                key: "mergeInvoice",
                validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
            },
            {
                key: "confirmationNotes",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            }
        ]);
    }
}
