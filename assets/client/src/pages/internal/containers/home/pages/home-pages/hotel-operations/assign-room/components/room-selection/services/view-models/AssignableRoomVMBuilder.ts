import {ThTranslation} from '../../../../../../../../../../../../common/utils/localization/ThTranslation';
import {RoomVM} from '../../../../../../../../../../services/rooms/view-models/RoomVM';
import {BookingOccupancyDO} from '../../../../../../../../../../services/bookings/occupancy/data-objects/BookingOccupancyDO';
import {BookingDO} from '../../../../../../../../../../services/bookings/data-objects/BookingDO';
import {RoomMaintenanceStatus} from '../../../../../../../../../../services/rooms/data-objects/RoomDO';
import {AssignableRoomVMContainer} from './AssignableRoomVMContainer';
import {AssignableRoomVM} from './AssignableRoomVM';

export class AssignableRoomVMBuilder {
    constructor(private _roomList: RoomVM[],
        private _booking: BookingDO, private _bookingOccupancy: BookingOccupancyDO) {
    }
    public build(thTranslation: ThTranslation): AssignableRoomVMContainer {
        this.sortRoomsByCategory();

        var assignableRoomVMList: AssignableRoomVM[] = [];
        _.forEach(this._roomList, (roomVM: RoomVM) => {
            var roomWithOccupancyVM = new AssignableRoomVM();
            roomWithOccupancyVM.roomVM = roomVM;

            if (roomVM.room.maintenanceStatus === RoomMaintenanceStatus.OutOfService) {
                roomWithOccupancyVM.errorMessage = thTranslation.translate("Out of Service")
            }
            else if (this._bookingOccupancy.getOccupancyForRoomId(roomVM.room.id) > 0) {
                roomWithOccupancyVM.errorMessage = thTranslation.translate("Room is occupied or reserved")
            }
            else if (!roomVM.categoryStats.capacity.canFit(this._booking.configCapacity)) {
                roomWithOccupancyVM.errorMessage = thTranslation.translate("Room cannot fit booking capacity")
            }

            assignableRoomVMList.push(roomWithOccupancyVM);
        });
        return new AssignableRoomVMContainer(assignableRoomVMList);
    }

    private sortRoomsByCategory() {
        this._roomList = this._roomList.sort((firstRoomVM: RoomVM, secondRoomVM: RoomVM) => {
            return (firstRoomVM.category.displayName > secondRoomVM.category.displayName) ? 1 : -1;
        });
    }
}