import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {ArrayValidationStructure} from '../../../utils/th-validation/structure/ArrayValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {NumberValidationRule} from '../../../utils/th-validation/rules/NumberValidationRule';
import {NumberInListValidationRule} from '../../../utils/th-validation/rules/NumberInListValidationRule';
import {InvoiceDO, InvoicePaymentStatus} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {InvoicePaymentMethodType} from '../../../data-layer/invoices/data-objects/payers/InvoicePaymentMethodDO';
import {CommissionType} from '../../../data-layer/common/data-objects/commission/CommissionDO';
import {InvoiceItemType} from '../../../data-layer/invoices/data-objects/items/InvoiceItemDO';

export class SaveInvoiceGroupDO {
    id: string;
    groupBookingId: string;
    invoiceList: InvoiceDO[];
    paymentStatus: InvoicePaymentStatus;

    public static getValidationStructure(): IValidationStructure {
        
        return new ObjectValidationStructure([
            {
				key: "id",
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
				        key: "bookingId",
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
                                validationStruct: new PrimitiveValidationStructure(NumberValidationRule.buildPriceNumberRule())
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
                                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([InvoiceItemType.AddOnProduct, InvoiceItemType.Booking]))
                            }
                        ]))
                    },
                    {
                        key: "paymentStatus",
                        validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([InvoicePaymentStatus.Closed, InvoicePaymentStatus.Open]))
                    }
                ]))
            },
            {
                key: "paymentStatus",
                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([InvoicePaymentStatus.Closed, InvoicePaymentStatus.Open]))
            }
        ]);
    }
}