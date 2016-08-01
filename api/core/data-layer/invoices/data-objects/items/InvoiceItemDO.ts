import {ThUtils} from '../../../../utils/ThUtils';
import {BaseDO} from '../../../common/base/BaseDO';
import {IInvoiceItemMeta} from './IInvoiceItemMeta';
import {AddOnProductInvoiceItemMetaDO} from './add-on-products/AddOnProductInvoiceItemMetaDO';
import {BookingDO} from '../../../bookings/data-objects/BookingDO';
import {IInvoiceDO} from '../InvoiceDO';

export enum InvoiceItemType {
    AddOnProduct, Booking
}

export interface IInvoiceItemDO extends IInvoiceDO {
    bookingId: string
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
    }
}