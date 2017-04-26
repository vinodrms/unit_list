import { AddOnProductDO } from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';

export interface GenerateBookingInvoiceAopMeta {
    addOnProductDO: AddOnProductDO;
    noOfItems: number;
}

export interface GenerateBookingInvoiceDO {
    groupBookingId: string;
    bookingId: string;
    attachReservedAddOnProductsFromBooking: boolean;
}