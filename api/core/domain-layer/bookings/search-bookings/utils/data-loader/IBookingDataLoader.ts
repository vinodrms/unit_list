import {BookingSearchDependencies} from './results/BookingSearchDependencies';

export interface IBookingDataLoader {
    loadData(): Promise<BookingSearchDependencies>;
}