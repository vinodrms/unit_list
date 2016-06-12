import {BaseDO} from '../../../common/base/BaseDO';

export enum InvoicePaymentMethodType {
    DefaultPaymentMethod, PayInvoiceByAgreement
}

export class InvoicePaymentMethodDO extends BaseDO {
    constructor() {
        super();
    }

    type: InvoicePaymentMethodType;
    amount: number;
    paymentMethodId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["type", "amount", "paymentMethodId"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
        
    }  
}