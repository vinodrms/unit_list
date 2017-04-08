import {RoomVM} from '../../../../../../../../../../../../../internal/services/rooms/view-models/RoomVM';
import {HotelOperationsRoomService} from '../../../../../../../../../../../../../internal/services/hotel-operations/room/HotelOperationsRoomService';

export class RoomMaintenanceStatusModalInput {
    private _roomVM : RoomVM;

    constructor(roomVM : RoomVM) {
        this._roomVM = roomVM;
    }
    public get roomVM() : RoomVM {
        return this._roomVM;
    }
}