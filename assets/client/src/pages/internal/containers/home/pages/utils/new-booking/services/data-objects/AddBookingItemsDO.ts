import {TransientBookingItem} from './TransientBookingItem';

export class EmailDistributionDO {
    email: string;
    guestName?: string;
}

export class AddBookingItemsDO {
    groupBookingId?: string;
    bookingList: TransientBookingItem[];
    confirmationEmailList: EmailDistributionDO[];
}