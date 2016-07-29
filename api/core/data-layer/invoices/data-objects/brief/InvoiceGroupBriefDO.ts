import {BaseDO} from '../../../common/base/BaseDO';

export class InvoiceGroupBriefDO extends BaseDO {
    invoiceGroupId: string;
    groupBookingId: string;
    price: number;
    
    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["invoiceGroupId", "groupBookingId", "price"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
    }
}