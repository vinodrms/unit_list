import {BaseDO} from '../../../common/base/BaseDO';
import {AddOnProductDO} from '../../../add-on-products/data-objects/AddOnProductDO';

export enum InvoiceItemType {
    AddOnProduct, PriceProduct, InvoiceFee
}

export class InvoiceItemDO extends BaseDO {
    constructor() {
        super();
    }

    id: string;
    type: InvoiceItemType;
    snapshot: Object;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        if (this.type === InvoiceItemType.AddOnProduct) {
            var addOnProduct = new AddOnProductDO();
            addOnProduct.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "snapshot"));

            this.snapshot = addOnProduct;
        }
    }
}