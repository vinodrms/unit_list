import {BaseDO} from '../../../common/base/BaseDO';
import {AddOnProductDO} from '../../../add-on-products/data-objects/AddOnProductDO';
import {PriceProductDO} from '../../../price-products/data-objects/PriceProductDO';

export enum InvoiceItemType {
    AddOnProduct, PriceProduct, InvoiceFee
}

export class InvoiceItemDO extends BaseDO {
    constructor() {
        super();
    }

    id: string;
    type: InvoiceItemType;
    qty: number;
    snapshot: Object;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type", "qty"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        if(this.getObjectPropertyEnsureUndefined(object, "snapshot") == null) {
            return;
        }

        if (this.type === InvoiceItemType.AddOnProduct) {
            var addOnProduct = new AddOnProductDO();
            addOnProduct.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "snapshot"));
            this.snapshot = addOnProduct;
        }
        else if (this.type === InvoiceItemType.PriceProduct) {
            var priceProduct = new PriceProductDO();
            priceProduct.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "snapshot"));
            this.snapshot = priceProduct;
        }
    }
}