import {RoomVM} from '../../../../../../../../../../../../../internal/services/rooms/view-models/RoomVM';
import {HotelOperationsRoomService} from '../../../../../../../../../../../../../internal/services/hotel-operations/room/HotelOperationsRoomService';

export class RoomMaintenanceStatusModalInput {
    private _roomVM : RoomVM;
    private _hotelOperationsRoomService: HotelOperationsRoomService;

    constructor(roomVM : RoomVM, HotelOperationsRoomService: HotelOperationsRoomService) {
        this._roomVM = roomVM;
        this._hotelOperationsRoomService = HotelOperationsRoomService;
    }
    public get roomVM() : RoomVM {
        return this._roomVM;
    }
    public get hotelOperationsRoomService() : HotelOperationsRoomService {
        return this._hotelOperationsRoomService;
    }
}