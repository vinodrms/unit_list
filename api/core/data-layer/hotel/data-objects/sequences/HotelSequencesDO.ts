import { BaseDO } from '../../../common/base/BaseDO';

export enum HotelSequenceType {
    InvoiceGroup,
    InvoiceItem,
    BookingGroup,
    BookingItem
}

var HotelSequences: { [index: number]: string; } = {};
HotelSequences[HotelSequenceType.InvoiceGroup] = "invoiceGroupSequence";
HotelSequences[HotelSequenceType.InvoiceItem] = "invoiceItemSequence";
HotelSequences[HotelSequenceType.BookingGroup] = "bookingGroupSequence";
export class HotelSequencesDO extends BaseDO {
    invoiceGroupSequence: number;
    invoiceItemSequence: number;
    bookingGroupSequence: number;
    
    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return [HotelSequences[HotelSequenceType.InvoiceGroup], HotelSequences[HotelSequenceType.InvoiceItem],
            HotelSequences[HotelSequenceType.BookingGroup], HotelSequences[HotelSequenceType.BookingItem]];
    }

    public setInitialValues() {
        this.invoiceGroupSequence = 1;
        this.invoiceItemSequence = 1;
        this.bookingGroupSequence = 1;
    }

    public static getSequenceKey(sequenceType: HotelSequenceType) {
        return HotelSequences[sequenceType];
    }
}