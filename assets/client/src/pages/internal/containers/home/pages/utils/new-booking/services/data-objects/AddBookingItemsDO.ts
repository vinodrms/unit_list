import {TransientBookingItem} from './TransientBookingItem';

export class AddBookingItemsDO {
    bookingList: TransientBookingItem[];
    confirmationEmailList: string[];
}