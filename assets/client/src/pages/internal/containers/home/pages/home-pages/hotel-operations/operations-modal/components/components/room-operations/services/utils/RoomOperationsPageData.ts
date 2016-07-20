import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomAttachedBookingResultDO} from '../../../../../../../../../../../services/hotel-operations/room/data-objects/RoomAttachedBookingResultDO';

export class RoomOperationsPageData {
    private _roomVM: RoomVM;
    private _attachedBookingResult: RoomAttachedBookingResultDO;

    constructor(roomVM: RoomVM, attachedBookingResult: RoomAttachedBookingResultDO) {
        this._roomVM = roomVM;
        this._attachedBookingResult = attachedBookingResult;
    }

    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
    }
    public get attachedBookingResult(): RoomAttachedBookingResultDO {
        return this._attachedBookingResult;
    }
    public set attachedBookingResult(attachedBookingResult: RoomAttachedBookingResultDO) {
        this._attachedBookingResult = attachedBookingResult;
    }
}