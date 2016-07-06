import {BaseDO} from '../../../common/base/BaseDO';

export enum InvoicePaymentMethodType {
    DefaultPaymentMethod, PayInvoiceByAgreement
}

export class InvoicePaymentMethodDO extends BaseDO {
    type: InvoicePaymentMethodType;
    value: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "value"];
    }
}