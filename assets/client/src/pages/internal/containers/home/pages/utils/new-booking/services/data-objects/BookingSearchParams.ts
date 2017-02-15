import { ThDateIntervalDO } from '../../../../../../../services/common/data-objects/th-dates/ThDateIntervalDO';
import { ConfigCapacityDO } from '../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';
import { TransientBookingItem } from './TransientBookingItem';

export class BookingSearchParams {
    constructor() {
        this.configCapacity = new ConfigCapacityDO();
    }

    customerId: string;
    interval: ThDateIntervalDO;
    configCapacity: ConfigCapacityDO;
    transientBookingList: TransientBookingItem[];
    bookingIdToOmit: string;

    public validNoAdults(): boolean {
        return this.configCapacity.validNoAdults();
    }
    public validNoChildren(): boolean {
        return this.configCapacity.validNoChildren();
    }
    public validNoBabies(): boolean {
        return this.configCapacity.validNoBabies();
    }
    public validNoBabyBeds(): boolean {
        return this.configCapacity.validNoBabyBeds();
    }

    public areValid(): boolean {
        return this.configCapacity.valid();
    }

    public buildPrototype(): BookingSearchParams {
        var bookingSearchParams = new BookingSearchParams();
        bookingSearchParams.customerId = this.customerId;
        bookingSearchParams.interval = new ThDateIntervalDO();
        bookingSearchParams.interval.buildFromObject(this.interval);
        bookingSearchParams.configCapacity = new ConfigCapacityDO();
        bookingSearchParams.configCapacity.buildFromObject(this.configCapacity);
        bookingSearchParams.bookingIdToOmit = this.bookingIdToOmit;
        return bookingSearchParams;
    }
}