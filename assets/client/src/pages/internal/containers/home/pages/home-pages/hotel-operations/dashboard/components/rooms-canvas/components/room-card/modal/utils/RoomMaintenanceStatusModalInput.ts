import {RoomVM} from '../../../../../../../../../../../../../internal/services/rooms/view-models/RoomVM';
import {HotelOperationsRoomService} from '../../../../../../../../../../../../../internal/services/hotel-operations/room/HotelOperationsRoomService';
import {RoomMaintenanceMeta} from '../../../../../../../../../../../../../internal/services/rooms/utils/RoomMaintenanceMeta';


export class RoomMaintenanceStatusModalInput {
    private _roomVM : RoomVM;
    private _roomMaintenanceMetaList: RoomMaintenanceMeta[]; 

    constructor(roomVM : RoomVM, roomMaintenanceMetaList?: RoomMaintenanceMeta[]) {
        this._roomVM = roomVM;
        this._roomMaintenanceMetaList = roomMaintenanceMetaList;
    }
    public get roomVM() : RoomVM {
        return this._roomVM;
    }
    public get roomMaintenanceMetaList() {
        return this._roomMaintenanceMetaList;
    }
}