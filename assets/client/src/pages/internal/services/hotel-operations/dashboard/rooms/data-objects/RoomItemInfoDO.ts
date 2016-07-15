import {BaseDO} from '../../../../../../../common/base/BaseDO';
import {ConfigCapacityDO} from '../../../../common/data-objects/bed-config/ConfigCapacityDO';
import {ThDateIntervalDO} from '../../../../common/data-objects/th-dates/ThDateIntervalDO';

export enum RoomItemStatus {
    Occupied,
    Reserved,
    Free
}

export class RoomItemInfoDO extends BaseDO {
    roomId: string;
    roomStatus: RoomItemStatus;

    customerId: string;
    customerName: string;

    bookingId: string;
    groupBookingId: string;
    bookingInterval: ThDateIntervalDO;
    bookingCapacity: ConfigCapacityDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["roomId", "roomStatus", "customerId", "customerName", "bookingId", "groupBookingId"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.bookingInterval = new ThDateIntervalDO();
        this.bookingInterval.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingInterval"));

        this.bookingCapacity = new ConfigCapacityDO();
        this.bookingCapacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingCapacity"));
    }
}