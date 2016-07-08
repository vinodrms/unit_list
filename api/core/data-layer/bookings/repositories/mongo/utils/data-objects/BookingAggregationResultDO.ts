import {BaseDO} from '../../../../../common/base/BaseDO';
import {GroupBookingStatus, BookingDO, GroupBookingInputChannel} from '../../../../data-objects/BookingDO';

export class BookingAggregationResultDO extends BaseDO {
    id: string;
    hotelId: string;
    versionId: number;
    groupBookingReference: string;
    status: GroupBookingStatus;
    inputChannel: GroupBookingInputChannel;
    noOfRooms: number;

    booking: BookingDO;

    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "hotelId", "versionId", "groupBookingReference", "status", "inputChannel", "noOfRooms"];
    }

    public buildFromObject(object: Object) {
        super.buildFromObject(object);

        this.booking = new BookingDO();

        // the aggregation transforms the array into an object and keeps the initial name of the field
        this.booking.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bookingList"));
        this.booking.groupBookingId = this.id;
        this.booking.groupBookingReference = this.groupBookingReference;
        this.booking.hotelId = this.hotelId;
        this.booking.versionId = this.versionId;
        this.booking.status = this.status;
        this.booking.inputChannel = this.inputChannel;
        this.booking.noOfRooms = this.noOfRooms;
    }
}