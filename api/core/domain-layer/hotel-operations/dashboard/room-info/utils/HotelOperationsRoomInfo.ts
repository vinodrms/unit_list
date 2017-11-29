import {ThDateDO} from '../../../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateIntervalDO} from '../../../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../data-layer/common/data-objects/bed-config/ConfigCapacityDO';

export enum RoomItemStatus {
    Occupied,
    Reserved,
    Free
}

export interface RoomItemInfo {
    roomId: string;
    roomStatus: RoomItemStatus;

    customerId: string;
    customerName?: string;

    bookingId: string;
    groupBookingId: string;
    bookingInterval: ThDateIntervalDO;
    bookingCapacity: ConfigCapacityDO;

    invoiceId?: string;
    invoicePrice?: number;
}

export class HotelOperationsRoomInfo {
    roomInfoList: RoomItemInfo[];
    referenceDate: ThDateDO;
    totalOccupiedRooms: number;
    totalInHouseGuests: number;

    constructor() {
        this.roomInfoList = [];
        this.totalOccupiedRooms = 0;
        this.totalInHouseGuests = 0;
    }
}