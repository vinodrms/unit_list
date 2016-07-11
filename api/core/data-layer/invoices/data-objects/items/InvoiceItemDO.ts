import {BaseDO} from '../../../common/base/BaseDO';
import {AddOnProductDO} from '../../../add-on-products/data-objects/AddOnProductDO';
import {PriceProductDO} from '../../../price-products/data-objects/PriceProductDO';
import {IInvoiceItemMeta} from './IInvoiceItemMeta';
import {AddOnProductInvoiceItemMetaDO} from './add-on-products/AddOnProductInvoiceItemMetaDO';
import {BookingPriceDO} from '../../../bookings/data-objects/price/BookingPriceDO';

export enum InvoiceItemType {
    AddOnProduct, Booking
}

export class InvoiceItemDO extends BaseDO {
    id: string;
    type: InvoiceItemType;
    meta: IInvoiceItemMeta;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        if (this.getObjectPropertyEnsureUndefined(object, "meta") == null) {
            return;
        }

        if (this.type === InvoiceItemType.AddOnProduct) {
            var addOnProductInvoiceItemMetaDO = new AddOnProductInvoiceItemMetaDO();
            addOnProductInvoiceItemMetaDO.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "meta"));
            this.meta = addOnProductInvoiceItemMetaDO;
        }
        else if(this.type === InvoiceItemType.Booking) {
            
        }
    }
}