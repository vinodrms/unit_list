import {ThTranslation} from '../../../../../../../../../../../../common/utils/localization/ThTranslation';
import {ThUtils} from '../../../../../../../../../../../../common/utils/ThUtils';
import {RoomVM} from '../../../../../../../../../../services/rooms/view-models/RoomVM';
import {BookingOccupancyDO} from '../../../../../../../../../../services/bookings/occupancy/data-objects/BookingOccupancyDO';
import {BookingDO} from '../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {BookingsDO} from '../../../../../../../../../../services/bookings/data-objects/BookingsDO';
import {RoomMaintenanceStatus} from '../../../../../../../../../../services/rooms/data-objects/RoomDO';
import {AssignableRoomVMContainer} from './AssignableRoomVMContainer';
import {AssignableRoomVM} from './AssignableRoomVM';

import * as _ from "underscore";

export interface RoomVMBuilderParams {
    roomList: RoomVM[];
    booking: BookingDO;
    bookingOccupancy: BookingOccupancyDO;
    checkedInBookings: BookingsDO;
    validateAlreadyCheckedInBooking: boolean;
}

export class AssignableRoomVMBuilder {
    private _thUtils: ThUtils;
    private _indexedCheckedInBookingsByRoomId: { [id: string]: BookingDO; };

    constructor(private _params: RoomVMBuilderParams) {
        this._thUtils = new ThUtils();
        this.sortRoomsByCategory();
        this.indexCheckedInRoomIdList();
    }
    public build(thTranslation: ThTranslation): AssignableRoomVMContainer {
        var assignableRoomVMList: AssignableRoomVM[] = [];
        _.forEach(this._params.roomList, (roomVM: RoomVM) => {
            var roomWithOccupancyVM = new AssignableRoomVM();
            roomWithOccupancyVM.roomVM = roomVM;

            if (roomVM.room.maintenanceStatus === RoomMaintenanceStatus.OutOfService) {
                roomWithOccupancyVM.errorMessage = thTranslation.translate("Out of Service");
            }
            else if (roomVM.room.maintenanceStatus === RoomMaintenanceStatus.OutOfOrder) {
                roomWithOccupancyVM.errorMessage = thTranslation.translate("Out of Order");
            }
            else if (this._params.bookingOccupancy.getOccupancyForRoomId(roomVM.room.id) > 0) {
                roomWithOccupancyVM.errorMessage = thTranslation.translate("Room is occupied or reserved");
            }
            else if (!roomVM.categoryStats.capacity.canFit(this._params.booking.configCapacity)) {
                roomWithOccupancyVM.errorMessage = thTranslation.translate("Room cannot fit booking capacity");
            }
            else if (this._params.validateAlreadyCheckedInBooking && this.roomHasCheckedInBooking(roomVM)) {
                roomWithOccupancyVM.errorMessage = thTranslation.translate("Room is occupied or reserved");
            }

            assignableRoomVMList.push(roomWithOccupancyVM);
        });
        return new AssignableRoomVMContainer(assignableRoomVMList);
    }

    private sortRoomsByCategory() {
        this._params.roomList = this._params.roomList.sort((firstRoomVM: RoomVM, secondRoomVM: RoomVM) => {
            return (firstRoomVM.category.displayName > secondRoomVM.category.displayName) ? 1 : -1;
        });
    }
    private indexCheckedInRoomIdList() {
        this._indexedCheckedInBookingsByRoomId = _.indexBy(this._params.checkedInBookings.bookingList, (booking: BookingDO) => { return booking.roomId });
    }
    private roomHasCheckedInBooking(roomVM: RoomVM): boolean {
        return !this._thUtils.isUndefinedOrNull(this._indexedCheckedInBookingsByRoomId[roomVM.room.id]);
    }
}