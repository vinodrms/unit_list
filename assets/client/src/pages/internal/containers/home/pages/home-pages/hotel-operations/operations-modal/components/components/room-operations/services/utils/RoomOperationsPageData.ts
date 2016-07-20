import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomAttachedBookingResultDO} from '../../../../../../../../../../../services/hotel-operations/room/data-objects/RoomAttachedBookingResultDO';
import {BedVM} from '../../../../../../../../../../../services/beds/view-models/BedVM';

export class RoomOperationsPageData {
    private _roomVM: RoomVM;
    private _bedVMList: BedVM[];

    private _attachedBookingResult: RoomAttachedBookingResultDO;

    constructor(roomVM: RoomVM, bedVMList: BedVM[], attachedBookingResult: RoomAttachedBookingResultDO) {
        this._roomVM = roomVM;
        this._attachedBookingResult = attachedBookingResult;
        this._bedVMList = bedVMList;
    }

    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
    }

    public get bedVMList(): BedVM[] {
        return this._bedVMList;
    }
    public set bedVMList(bedVMList: BedVM[]) {
        this._bedVMList = bedVMList;
    }

    public get attachedBookingResult(): RoomAttachedBookingResultDO {
        return this._attachedBookingResult;
    }
    public set attachedBookingResult(attachedBookingResult: RoomAttachedBookingResultDO) {
        this._attachedBookingResult = attachedBookingResult;
    }
}