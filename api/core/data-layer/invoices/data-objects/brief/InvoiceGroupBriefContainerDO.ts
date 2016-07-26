import {BaseDO} from '../../../common/base/BaseDO';
import {InvoiceGroupBriefDO} from './InvoiceGroupBriefDO';

export class InvoiceGroupBriefContainerDO extends BaseDO {
    customerId: string;
    invoiceGroupBriefList: InvoiceGroupBriefDO[];

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["customerId"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.invoiceGroupBriefList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "invoiceGroupBriefList"), (invoiceGroupBriefObject: Object) => {
           var invoiceGroupBriefDO = new InvoiceGroupBriefDO();
           invoiceGroupBriefDO.buildFromObject(invoiceGroupBriefObject)
           this.invoiceGroupBriefList.push(invoiceGroupBriefDO);
        });
    }
}