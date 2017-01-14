import { BaseDO } from '../../../common/base/BaseDO';

export enum HotelSequenceType {
    InvoiceGroup,
    InvoiceItem
}

var HotelSequences: { [index: number]: string; } = {};
HotelSequences[HotelSequenceType.InvoiceGroup] = "invoiceGroupSequence";
HotelSequences[HotelSequenceType.InvoiceItem] = "invoiceItemSequence";

export class HotelSequencesDO extends BaseDO {
    invoiceGroupSequence: number;
    invoiceItemSequence: number;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return [HotelSequences[HotelSequenceType.InvoiceGroup], HotelSequences[HotelSequenceType.InvoiceItem]];
    }

    public setInitialValues() {
        this.invoiceGroupSequence = 1;
        this.invoiceItemSequence = 1;
    }

    public static getSequenceKey(sequenceType: HotelSequenceType) {
        return HotelSequences[sequenceType];
    }
}