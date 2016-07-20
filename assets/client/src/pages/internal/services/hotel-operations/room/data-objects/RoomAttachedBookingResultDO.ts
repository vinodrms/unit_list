import {BaseDO} from '../../../../../../common/base/BaseDO';
import {BookingDO} from '../../../bookings/data-objects/BookingDO';

export enum RoomAttachedBookingResultType {
    NoBooking,
    CheckedInBooking,
    ReservedBooking
}

export class RoomAttachedBookingResultDO extends BaseDO {
    resultType: RoomAttachedBookingResultType;
    booking: BookingDO;

    constructor() {
        super();
    }

    protected getPrimitivePropertyKeys(): string[] {
        return ["resultType"];
    }
    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.booking = new BookingDO();
        this.booking.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "booking"));
    }

    public hasAttachedBooking(): boolean {
        return this.resultType === RoomAttachedBookingResultType.NoBooking;
    }
    public hasReservedBooking(): boolean {
        return this.resultType === RoomAttachedBookingResultType.ReservedBooking;
    }
    public hasCheckedInBooking(): boolean {
        return this.resultType === RoomAttachedBookingResultType.CheckedInBooking;
    }
}