import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';

export interface GenerateBookingInvoiceDO {
    groupBookingId: string;
    bookingId: string;
    addOnProductDOList?: AddOnProductDO[];
}