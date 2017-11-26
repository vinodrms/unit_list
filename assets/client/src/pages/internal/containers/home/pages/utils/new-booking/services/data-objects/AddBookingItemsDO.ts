import { TransientBookingItem } from './TransientBookingItem';

export class EmailDistributionDO {
    email: string;
    recipientName?: string;
}

export class AddBookingItemsDO {
    groupBookingId?: string;
    bookingList: TransientBookingItem[];
    confirmationEmailList: EmailDistributionDO[];
    mergeInvoice: boolean;
    confirmationNotes: string;
}
