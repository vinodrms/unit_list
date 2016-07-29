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
    _metaObject: Object;

    constructor(public bookingInvoiceItemMeta?: IInvoiceItemDO) {
        super();

        var thUtils = new ThUtils();
        if (thUtils.isUndefinedOrNull(bookingInvoiceItemMeta)) {
            delete this.bookingInvoiceItemMeta;
        }
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "type"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this._metaObject = this.getObjectPropertyEnsureUndefined(object, "_metaObject")
    }

    public get meta(): Promise<IInvoiceItemMeta> {
        return new Promise<IInvoiceItemMeta>((resolve: { (result: IInvoiceItemMeta): void }, reject: { (err: any): void }) => {
            try {
                this.getMetaCore(resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    private getMetaCore(resolve: { (result: IInvoiceItemMeta): void }, reject: { (err: any): void }) {
        if (this.type === InvoiceItemType.AddOnProduct) {
            var addOnProductInvoiceItemMetaDO = new AddOnProductInvoiceItemMetaDO();
            addOnProductInvoiceItemMetaDO.buildFromObject(this._metaObject);
            resolve(addOnProductInvoiceItemMetaDO);
        }
        else if (this.type === InvoiceItemType.Booking) {
            this.bookingInvoiceItemMeta.bookingRepo.getBookingById({ hotelId: this.bookingInvoiceItemMeta.hotelId },
                this.bookingInvoiceItemMeta.groupBookingId, this.bookingInvoiceItemMeta.bookingId).then((booking: BookingDO) => {
                    resolve(booking.price);
                }).catch((error: any) => {
                    reject(error);
                });
        }
    }
}