import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomAttachedBookingResultDO} from '../../../../../../../../../../../services/hotel-operations/room/data-objects/RoomAttachedBookingResultDO';
import {BedVM} from '../../../../../../../../../../../services/beds/view-models/BedVM';
import {RoomAmenitiesDO} from '../../../../../../../../../../../services/settings/data-objects/RoomAmenitiesDO';
import {RoomAttributesDO} from '../../../../../../../../../../../services/settings/data-objects/RoomAttributesDO';

export class RoomOperationsPageData {
    private _roomVM: RoomVM;
    private _bedVMList: BedVM[];
    private _attachedBookingResult: RoomAttachedBookingResultDO;
    private _allRoomAmenities: RoomAmenitiesDO;
    private _allRoomAttributes: RoomAttributesDO;

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

    public get allRoomAmenities(): RoomAmenitiesDO {
        return this._allRoomAmenities;
    }
    public set allRoomAmenities(allRoomAmenities: RoomAmenitiesDO) {
        this._allRoomAmenities = allRoomAmenities;
    }

    public get allRoomAttributes(): RoomAttributesDO {
        return this._allRoomAttributes;
    }
    public set allRoomAttributes(allRoomAttributes: RoomAttributesDO) {
        this._allRoomAttributes = allRoomAttributes;
    }
}