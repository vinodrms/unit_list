import {ThError} from '../../../utils/th-responses/ThError';
import {BaseDO} from '../../common/base/BaseDO';
import {InvoicePayerDO} from './payers/InvoicePayerDO';
import {InvoiceItemDO, InvoiceItemType} from './items/InvoiceItemDO';
import {IPriceableEntity} from './price/IPriceableEntity';
import {IBookingRepository} from '../../bookings/repositories/IBookingRepository';
import {IInvoiceItemMeta} from './items/IInvoiceItemMeta';
import {BookingDO} from '../../bookings/data-objects/BookingDO';

export enum InvoicePaymentStatus {
    Open, Closed
}

export interface IInvoiceDO {
    bookingRepo: IBookingRepository,
    hotelId: string,
    groupBookingId: string
}

export class InvoiceDO extends BaseDO implements IPriceableEntity {
    constructor() {
        super();
    }

    bookingId: string;
    payerList: InvoicePayerDO[];
    itemList: InvoiceItemDO[];
    paymentStatus: InvoicePaymentStatus;

    protected getPrimitivePropertyKeys(): string[] {
        return ["bookingId", "paymentStatus"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.payerList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "payerList"), (payerObject: Object) => {
            var payerDO = new InvoicePayerDO();
            payerDO.buildFromObject(payerObject);
            this.payerList.push(payerDO);
        });
        this.itemList = [];
        this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "itemList"), (itemObject: Object) => {
            var itemDO = new InvoiceItemDO();
            itemDO.buildFromObject(itemObject);
            this.itemList.push(itemDO);
        });
    }

    public getPayerCustomerIdList(): string[] {
        return _.chain(this.payerList)
            .map((payerDO: InvoicePayerDO) => {
                return payerDO.customerId;
            })
            .uniq().value();
    }

    public getAddOnProductIdList(): string[] {
        return this.getItemIdListByItemType(InvoiceItemType.AddOnProduct);
    }

    private getItemIdListByItemType(itemType: InvoiceItemType): string[] {
        return _.chain(this.itemList)
            .filter((invoiceItem: InvoiceItemDO) => {
                return invoiceItem.type === itemType;
            })
            .map((invoiceItem: InvoiceItemDO) => {
                return invoiceItem.id;
            })
            .value();
    }

    public linkBookingPrices(bookingList: BookingDO[]) {
        _.forEach(this.itemList, (item: InvoiceItemDO) => {
            if(item.type === InvoiceItemType.Booking) {
                var booking = _.find(bookingList, (booking: BookingDO) => {
                    return booking.bookingId === item.id;
                });
                item.meta = booking.price;
            }
        });             
    }

    public getPrice(): number {
        return _.reduce(this.itemList, function(memo: number, item: InvoiceItemDO){ return memo + item.meta.getNumberOfItems() * item.meta.getPrice(); }, 0);
    }
}