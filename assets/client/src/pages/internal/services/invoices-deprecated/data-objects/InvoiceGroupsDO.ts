import {BaseDO} from '../../../../../common/base/BaseDO';
import {InvoiceGroupDO} from './InvoiceGroupDO';

export class InvoiceGroupsDO extends BaseDO {
    invoiceGroupList: InvoiceGroupDO[];

    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.invoiceGroupList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "invoiceGroupList"), (invoiceGroupObject: Object) => {
            var invoiceGroupDO = new InvoiceGroupDO();
            invoiceGroupDO.buildFromObject(invoiceGroupObject);
            this.invoiceGroupList.push(invoiceGroupDO);
        });
    }
}