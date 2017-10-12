import _ = require('underscore');
import { IGenerateBookingInvoiceActionStrategy } from "./IGenerateBookingInvoiceActionStrategy";
import { InvoiceDO } from "../../../../data-layer/invoices/data-objects/InvoiceDO";
import { ThError } from "../../../../utils/th-responses/ThError";
import { AppContext } from "../../../../utils/AppContext";
import { SessionContext } from "../../../../utils/SessionContext";
import { InvoiceItemDO, InvoiceItemType } from "../../../../data-layer/invoices/data-objects/items/InvoiceItemDO";
import { BookingDO } from "../../../../data-layer/bookings/data-objects/BookingDO";
import { BookingInvoiceItem } from "../GenerateBookingInvoiceDO";

export abstract class AGenerateBookingInvoiceActionStrategy implements IGenerateBookingInvoiceActionStrategy {
    // we want all the timestamps for the new payments/items to be the same
    private timestamp: number;

    constructor(protected appContext: AppContext, protected sessionContext: SessionContext,
        protected booking: BookingDO, protected initialInvoiceItemList: BookingInvoiceItem[]) {
        this.timestamp = (new Date()).getTime();
    }

    public abstract generateBookingInvoice(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void });

    protected getInvoiceItemList(): InvoiceItemDO[] {
        let bookingItem = this.getBookingInvoiceItem();
        let itemList: InvoiceItemDO[] = [bookingItem];
        let reservedItemList = this.getReservedAddOnProductItemList();
        itemList = itemList.concat(reservedItemList);
        return itemList;
    }
    private getBookingInvoiceItem(): InvoiceItemDO {
        var bookingInvoiceItem = new InvoiceItemDO();
        bookingInvoiceItem.type = InvoiceItemType.Booking;
        bookingInvoiceItem.id = this.booking.id;
        this.stampItem(bookingInvoiceItem);
        return bookingInvoiceItem;
    }
    private getReservedAddOnProductItemList(): InvoiceItemDO[] {
        let itemList: InvoiceItemDO[] = [];
        _.forEach(this.initialInvoiceItemList, (item: BookingInvoiceItem) => {
            let aopInvoiceItem = new InvoiceItemDO();
            aopInvoiceItem.buildFromAddOnProductDO(item.addOnProduct, item.noOfItems, item.addOnProduct.getVatId());
            this.stampItem(aopInvoiceItem);
            itemList.push(aopInvoiceItem);
        });
        return itemList;
    }
    private stampItem(item: InvoiceItemDO) {
        item.transactionId = this.appContext.thUtils.generateUniqueID();
        item.timestamp = this.timestamp;
    }
}
