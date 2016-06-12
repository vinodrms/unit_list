import {BaseDO} from '../../../common/base/BaseDO';

export enum InvoiceItemType {
    AddOnProduct, PriceProduct, InvoiceFee
}

export class InvoiceItemDO extends BaseDO {
    constructor() {
        super();
    }

    id: string;
    type: InvoiceItemType;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
        
    }  
}