import { ThUtils } from '../../../../utils/ThUtils';
import { BaseDO } from '../../../common/base/BaseDO';
import { IInvoiceItemMeta } from './IInvoiceItemMeta';
import { AddOnProductInvoiceItemMetaDO } from './add-on-products/AddOnProductInvoiceItemMetaDO';
import { FeeInvoiceItemMetaDO } from './invoice-fee/FeeInvoiceItemMetaDO';
import { CustomerDO } from '../../../customers/data-objects/CustomerDO';
import { RoomCommissionItemMetaDO } from "./room-commission/RoomCommissionItemMetaDO";
import { BookingPriceDO } from "../../../bookings/data-objects/price/BookingPriceDO";
import { AddOnProductSnapshotDO } from "../../../add-on-products/data-objects/AddOnProductSnapshotDO";

export enum InvoiceItemType {
    AddOnProduct, Booking, InvoiceFee, RoomCommission
}

export class InvoiceItemDO extends BaseDO {
    id: string;
    type: InvoiceItemType;
    meta: IInvoiceItemMeta;
    transactionId: string;
    timestamp: number;
    // attribute used for grouping items; e.g., a Booking item can be followed by AddOnProduct or InvoiceFee items
    parentTransactionId: string;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type", "transactionId", "timestamp", "parentTransactionId"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        let metaObject = this.getObjectPropertyEnsureUndefined(object, "meta");
        if (this.type === InvoiceItemType.Booking) {
            var bookingPrice = new BookingPriceDO();
            bookingPrice.buildFromObject(metaObject);
            this.meta = bookingPrice;
        }
        else if (this.type === InvoiceItemType.AddOnProduct) {
            var addOnProductInvoiceItemMetaDO = new AddOnProductInvoiceItemMetaDO();
            addOnProductInvoiceItemMetaDO.buildFromObject(metaObject);
            this.meta = addOnProductInvoiceItemMetaDO;
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

    public buildFromAddOnProductDO(aop: AddOnProductSnapshotDO, numberOfItems: number, vatId: string) {

        var aopInvoiceItemMeta = new AddOnProductInvoiceItemMetaDO();
        aopInvoiceItemMeta.aopDisplayName = aop.name;
        aopInvoiceItemMeta.numberOfItems = numberOfItems;
        aopInvoiceItemMeta.pricePerItem = aop.price;
        aopInvoiceItemMeta.vatId = vatId;

        this.meta = aopInvoiceItemMeta;
        this.type = InvoiceItemType.AddOnProduct;
        this.id = aop.id;
    }

    public buildItemFromRoomCommission(deductedCommissionPrice: number, vatId: string) {
        var meta = new RoomCommissionItemMetaDO();
        meta.buildFromRoomCommission(deductedCommissionPrice, vatId);
        this.meta = meta;
        this.type = InvoiceItemType.RoomCommission;
    }

    public getTotalPrice(): number {
        let thUtils = new ThUtils();
        return thUtils.roundNumberToTwoDecimals(this.meta.getTotalPrice());
    }
}
