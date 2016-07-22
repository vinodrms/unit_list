import {BookingConfirmationStatus} from './BookingDO';
import {BookingIntervalEditRight} from './BookingEditRights';

export interface BookingMetaOptions {
    confirmationStatus: BookingConfirmationStatus;
    displayName: string;
    intervalEditRight: BookingIntervalEditRight;
}

export class BookingMeta {
    confirmationStatus: BookingConfirmationStatus;
    displayName: string;
    intervalEditRight: BookingIntervalEditRight;

    constructor(metaOptions: BookingMetaOptions) {
        this.confirmationStatus = metaOptions.confirmationStatus;
        this.displayName = metaOptions.displayName;
        this.intervalEditRight = metaOptions.intervalEditRight;
    }
}