import {TransientBookingItem} from './TransientBookingItem';

export class AddBookingItemsDO {
    groupBookingId?: string;
    bookingList: TransientBookingItem[];
    confirmationEmailList: string[];
}