import {BaseDO} from '../../../../../../common/base/BaseDO';
import {ThUtils} from '../../../../../../common/utils/ThUtils';
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

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        if (this.type === InvoiceItemType.AddOnProduct) {
            var metaObject = this.getObjectPropertyEnsureUndefined(object, "meta");
            
            var addOnProductInvoiceItemMetaDO = new AddOnProductInvoiceItemMetaDO();
            addOnProductInvoiceItemMetaDO.buildFromObject(metaObject);
            this.meta = addOnProductInvoiceItemMetaDO;
        } 
        else if(this.type === InvoiceItemType.Booking) {
            var metaObject = this.getObjectPropertyEnsureUndefined(object, "meta");

            var bookingPrice = new BookingPriceDO();
            bookingPrice.buildFromObject(metaObject);
            this.meta = bookingPrice;
        }  
    }
}