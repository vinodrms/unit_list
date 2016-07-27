import {BookingConfirmationStatus} from './BookingDO';
import {BookingIntervalEditRight, BookingNoShowEditRight, BookingAssignRoomRight, 
        BookingCapacityEditRight, BookingPaymentGuaranteeEditRight} from './BookingEditRights';

export interface BookingMetaOptions {
    confirmationStatus: BookingConfirmationStatus;
    displayName: string;
    displayClassName: string;
    fontName: string;
    intervalEditRight: BookingIntervalEditRight;
    noShowEditRight: BookingNoShowEditRight;
    assignRoomRight: BookingAssignRoomRight;
    capacityEditRight: BookingCapacityEditRight;
    paymentGuaranteeEditRight: BookingPaymentGuaranteeEditRight;
}

export class BookingMeta {
    confirmationStatus: BookingConfirmationStatus;
    displayName: string;
    displayClassName: string;
    fontName: string;
    intervalEditRight: BookingIntervalEditRight;
    noShowEditRight: BookingNoShowEditRight;
    assignRoomRight: BookingAssignRoomRight;
    capacityEditRight: BookingCapacityEditRight;
    paymentGuaranteeEditRight: BookingPaymentGuaranteeEditRight;

    constructor(metaOptions: BookingMetaOptions) {
        this.confirmationStatus = metaOptions.confirmationStatus;
        this.displayName = metaOptions.displayName;
        this.displayClassName = metaOptions.displayClassName;
        this.fontName = metaOptions.fontName;
        this.intervalEditRight = metaOptions.intervalEditRight;
        this.noShowEditRight = metaOptions.noShowEditRight;
        this.assignRoomRight = metaOptions.assignRoomRight;
        this.capacityEditRight = metaOptions.capacityEditRight;
        this.paymentGuaranteeEditRight = metaOptions.paymentGuaranteeEditRight;
    }
}