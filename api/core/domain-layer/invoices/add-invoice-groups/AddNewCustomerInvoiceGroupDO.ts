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

export class AddNewCustomerInvoiceGroupDO {
    invoiceList: InvoiceDO[];

    public static getValidationStructure(): IValidationStructure {
        return new ObjectValidationStructure([
            {
                key: "invoiceList",
                validationStruct: new ArrayValidationStructure(new ObjectValidationStructure([
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
                                validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
                            },
                            {
                                key: "type",
                                validationStruct: new PrimitiveValidationStructure(new NumberInListValidationRule([InvoiceItemType.AddOnProduct, InvoiceItemType.InvoiceFee, InvoiceItemType.PriceProduct]))
                            },
                            {
                                key: "qty",
                                validationStruct: new PrimitiveValidationStructure(new NumberValidationRule())
                            }
                        ]))
                    }
                ]))
            }
        ]);
    }
}