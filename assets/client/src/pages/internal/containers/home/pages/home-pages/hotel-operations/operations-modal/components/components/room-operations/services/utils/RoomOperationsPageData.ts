import {RoomVM} from '../../../../../../../../../../../services/rooms/view-models/RoomVM';
import {RoomAttachedBookingResultVM} from '../../../../../../../../../../../services/hotel-operations/room/view-models/RoomAttachedBookingResultVM';
import {BedVM} from '../../../../../../../../../../../services/beds/view-models/BedVM';
import {RoomAmenitiesDO} from '../../../../../../../../../../../services/settings/data-objects/RoomAmenitiesDO';
import {RoomAttributesDO} from '../../../../../../../../../../../services/settings/data-objects/RoomAttributesDO';

export class RoomOperationsPageData {
    private _roomVM: RoomVM;
    private _bedVMList: BedVM[];
    private _attachedBookingResultVM: RoomAttachedBookingResultVM;
    private _allRoomAmenities: RoomAmenitiesDO;
    private _allRoomAttributes: RoomAttributesDO;

    constructor(roomVM: RoomVM, bedVMList: BedVM[], attachedBookingResult: RoomAttachedBookingResultVM) {
        this._roomVM = roomVM;
        this._attachedBookingResultVM = attachedBookingResult;
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

    public get attachedBookingResultVM(): RoomAttachedBookingResultVM {
        return this._attachedBookingResultVM;
    }
    public set attachedBookingResultVM(attachedBookingResult: RoomAttachedBookingResultVM) {
        this._attachedBookingResultVM = attachedBookingResult;
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