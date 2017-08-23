import { IValidationStructure } from '../../../utils/th-validation/structure/core/IValidationStructure';
import { ObjectValidationStructure } from '../../../utils/th-validation/structure/ObjectValidationStructure';
import { PrimitiveValidationStructure } from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import { ArrayValidationStructure } from '../../../utils/th-validation/structure/ArrayValidationStructure';
import { StringValidationRule } from '../../../utils/th-validation/rules/StringValidationRule';
import { NumberValidationRule } from '../../../utils/th-validation/rules/NumberValidationRule';
import { NumberInListValidationRule } from '../../../utils/th-validation/rules/NumberInListValidationRule';
import { InvoiceDO, InvoicePaymentStatus, InvoiceAccountingType } from '../../../data-layer/invoices-deprecated/data-objects/InvoiceDO';
import { InvoicePaymentMethodType } from '../../../data-layer/invoices-deprecated/data-objects/payers/InvoicePaymentMethodDO';
import { CommissionType } from '../../../data-layer/common/data-objects/commission/CommissionDO';
import { InvoiceItemType, InvoiceItemAccountingType } from '../../../data-layer/invoices-deprecated/data-objects/items/InvoiceItemDO';
import { TransactionFeeType } from "../../../data-layer/common/data-objects/payment-method/TransactionFeeDO";

export class SaveInvoiceGroupDO {
    id: string;
    groupBookingId: string;
    invoiceList: InvoiceDO[];

    public static getValidationStructure(): IValidationStructure {

        return new ObjectValidationStructure([
            {
                key: "id",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "invoiceGroupReference",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "groupBookingId",
                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
            },
            {
                key: "invoiceList",
                validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
                    {
                        key: "id",
                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                    },
                    {
                        key: "accountingType",
                        validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([InvoiceAccountingType.Debit, InvoiceAccountingType.Credit]))
                    },
                    {
                        key: "bookingId",
                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                    },
                    {
                        key: "invoiceReference",
                        validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                    },
                    {
                        key: "payerList",
                        validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
                            {
                                key: "customerId",
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
                            },
                            {
                                key: "priceToPay",
                                validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
                            },
                            {
                                key: "priceToPayPlusTransactionFee",
                                validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
                            },
                            {
                                key: "additionalInvoiceDetails",
                                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable(2000))
                            },
                            {
                                key: "transactionFeeSnapshot",
                                validationStruct: new ObjectValidationStructure([
                                    {
                                        key: "type",
                                        validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([TransactionFeeType.Fixed, TransactionFeeType.Percentage]))
                                    },
                                    {
                                        key: "amount",
                                        validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildNullable())
                                    }
                                ])
                            }
                        ]))
                    },
                    {
                        key: "itemList",
                        validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
                            {
                                key: "id",
                                validationStruct: new PrimitiveValidationStructure(StringValidationRule.buildNullable())
                            },
                            {
                                key: "type",
                                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([
                                    InvoiceItemType.AddOnProduct, InvoiceItemType.Booking,
                                    InvoiceItemType.InvoiceFee, InvoiceItemType.RoomCommission
                                ]))
                            },
                            {
                                key: "accountingType",
                                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([InvoiceItemAccountingType.Debit, InvoiceItemAccountingType.Credit]))
                            }
                        ]))
                    },
                    {
                        key: "paymentStatus",
                        validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([InvoicePaymentStatus.Paid, InvoicePaymentStatus.Unpaid, InvoicePaymentStatus.LossAcceptedByManagement]))
                    }
                ]))
            }
        ]);
    }
}
