import { BaseDO } from '../../../../../../common/base/BaseDO';
import { ThUtils } from '../../../../../../common/utils/ThUtils';
import { IInvoiceItemMeta } from './IInvoiceItemMeta';
import { AddOnProductInvoiceItemMetaDO } from './add-on-products/AddOnProductInvoiceItemMetaDO';
import { FeeInvoiceItemMetaDO } from './invoice-fee/FeeInvoiceItemMetaDO';
import { BookingPriceDO } from '../../../bookings/data-objects/price/BookingPriceDO';
import { CustomerDO } from '../../../customers/data-objects/CustomerDO';
import { RoomCommissionItemMetaDO } from "./room-commission/RoomCommissionItemMetaDO";

export enum InvoiceItemType {
    AddOnProduct, Booking, InvoiceFee, RoomCommission
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

        let metaObject = this.getObjectPropertyEnsureUndefined(object, "meta");
        if (this.type === InvoiceItemType.AddOnProduct) {
            var addOnProductInvoiceItemMetaDO = new AddOnProductInvoiceItemMetaDO();
            addOnProductInvoiceItemMetaDO.buildFromObject(metaObject);
            this.meta = addOnProductInvoiceItemMetaDO;
        }
        else if (this.type === InvoiceItemType.Booking) {
            var bookingPrice = new BookingPriceDO();
            bookingPrice.buildFromObject(metaObject);
            this.meta = bookingPrice;
        }
        else if (this.type === InvoiceItemType.InvoiceFee) {
            var feeInvoiceItemMetaDO = new FeeInvoiceItemMetaDO();
            feeInvoiceItemMetaDO.buildFromObject(metaObject);
            this.meta = feeInvoiceItemMetaDO;
        }
        else if (this.type === InvoiceItemType.RoomCommission) {
            var roomCommissionItemMetaDO = new RoomCommissionItemMetaDO();
            roomCommissionItemMetaDO.buildFromObject(metaObject);
            this.meta = roomCommissionItemMetaDO;
        }
    }
    public buildFeeItemFromCustomerDO(customerDO: CustomerDO) {
        var meta = new FeeInvoiceItemMetaDO();
        meta.buildFromCustomerDO(customerDO);
        this.meta = meta;
        this.type = InvoiceItemType.InvoiceFee;
    }
    public isDerivedFromBooking(): boolean {
        return this.type === InvoiceItemType.InvoiceFee
            || this.type === InvoiceItemType.RoomCommission
            || (this.type === InvoiceItemType.AddOnProduct && !this.meta.isMovable());
    }
    public isBookingPrice(): boolean {
        return this.type === InvoiceItemType.Booking;
    }
}