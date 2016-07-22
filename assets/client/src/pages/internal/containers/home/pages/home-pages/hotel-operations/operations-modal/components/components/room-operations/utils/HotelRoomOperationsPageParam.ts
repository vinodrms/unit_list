import {AHotelOperationsPageParam} from '../../../../services/utils/AHotelOperationsPageParam';
import {HotelOperationsPageType} from '../../../../services/utils/HotelOperationsPageType';

export class HotelRoomOperationsPageParam extends AHotelOperationsPageParam {
    private static RoomFontName = "@";
    roomId: string;

    constructor(roomId: string) {
        super(HotelOperationsPageType.RoomOperations, HotelRoomOperationsPageParam.RoomFontName);
        this.roomId = roomId;
    }
}