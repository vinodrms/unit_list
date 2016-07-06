import {ThError} from '../../../../../utils/th-responses/ThError';
import {BookingSearchDependencies} from './results/BookingSearchDependencies';

export abstract class ABookingDataLoader {
    constructor() {
    }

    public loadData(): Promise<BookingSearchDependencies> {
        return new Promise<BookingSearchDependencies>((resolve: { (result: BookingSearchDependencies): void }, reject: { (err: ThError): void }) => {
            this.loadDataCore(resolve, reject);
        });
    }
    protected abstract loadDataCore(resolve: { (result: BookingSearchDependencies): void }, reject: { (err: ThError): void });
}