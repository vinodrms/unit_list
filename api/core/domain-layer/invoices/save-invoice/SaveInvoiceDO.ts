import { IValidationStructure } from "../../../utils/th-validation/structure/core/IValidationStructure";
import { ObjectValidationStructure } from "../../../utils/th-validation/structure/ObjectValidationStructure";
import { PrimitiveValidationStructure } from "../../../utils/th-validation/structure/PrimitiveValidationStructure";
import { StringValidationRule } from "../../../utils/th-validation/rules/StringValidationRule";
import { NumberInListValidationRule } from "../../../utils/th-validation/rules/NumberInListValidationRule";
import { InvoicePaymentStatus, InvoiceAccountingType } from "../../../data-layer/invoices/data-objects/InvoiceDO";
import { ArrayValidationStructure } from "../../../utils/th-validation/structure/ArrayValidationStructure";
import { InvoiceItemType } from "../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { InvoicePaymentMethodType } from "../../../data-layer/invoices/data-objects/payer/InvoicePaymentMethodDO";
import { BooleanValidationRule } from "../../../utils/th-validation/rules/BooleanValidationRule";
import { NumberValidationRule } from "../../../utils/th-validation/rules/NumberValidationRule";

export class SaveInvoiceDO {

    public static getValidationStructure(): IValidationStructure {

        return new ObjectValidationStructure([
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "groupId",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "reference",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "paymentStatus",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([
                    // the client uses -1 to map transient invoices
                    -1, InvoicePaymentStatus.Unpaid, InvoicePaymentStatus.Paid, InvoicePaymentStatus.LossAcceptedByManagement
                ]))
            },
            {
                key: "accountingType",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([
                    InvoiceAccountingType.Debit, InvoiceAccountingType.Credit
                ]))
            },
            {
                key: "itemList",
                validationStruct: new ArrayValidationStructure(
                    new ObjectValidationStructure([
                        {
                            key: "id",
                            validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                        },
                        {
                            key: "type",
                            validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([InvoiceItemType.AddOnProduct, InvoiceItemType.Booking, InvoiceItemType.InvoiceFee, InvoiceItemType.RoomCommission]))
                        },
                        {
                            key: "meta",
                            validationStruct: new ObjectValidationStructure([])
                        },
                        {
                            key: "transactionId",
                            validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                        },
                    ])
                )
            },
            {
                key: "payerList",
                validationStruct: new ArrayValidationStructure(
                    new ObjectValidationStructure([
                        {
                            key: "customerId",
                            validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                        },
                        {
                            key: "paymentList",
                            validationStruct: new ArrayValidationStructure(
                                new ObjectValidationStructure([
                                    {
                                        key: "transactionId",
                                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
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
                                                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                                            }
                                        ])
                                    },
                                    {
                                        key: "shouldApplyTransactionFee",
                                        validationStruct: new PrimitiveValidationStructure(new BooleanValidationRule())
                                    },
                                    {
                                        key: "amount",
                                        validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
                                    },
                                    {
                                        key: "amountPlusTransactionFee",
                                        validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
                                    },
                                    {
                                        key: "notes",
                                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                                    }
                                ])
                            )
                        }
                    ])
                )
            }
        ]);
    }
}
