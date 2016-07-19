import {RoomVM} from '../../../../../../../../../../services/rooms/view-models/RoomVM';
import {ConfigCapacityDO} from '../../../../../../../../../../services/common/data-objects/bed-config/ConfigCapacityDO';

export class AssignableRoomVM {
    public static AssignableFontName: string = "Z";
    public static NotAssignableFontName: string = "+";

    private _roomVM: RoomVM;
    private _roomCapacity: ConfigCapacityDO;
    private _isAssignableToBooking: boolean;
    private _errorMessage: string;
    private _fontName: string;

    constructor() {
        this._errorMessage = "";
        this._isAssignableToBooking = true;
        this._fontName = AssignableRoomVM.AssignableFontName;
    }

    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
        this._roomCapacity = this._roomVM.capacity;
    }

    public get roomCapacity(): ConfigCapacityDO {
        return this._roomCapacity;
    }
    public set roomCapacity(roomCapacity: ConfigCapacityDO) {
        this._roomCapacity = roomCapacity;
    }

    public get isAssignableToBooking(): boolean {
        return this._isAssignableToBooking;
    }
    public set isAssignableToBooking(isAssignableToBooking: boolean) {
        this._isAssignableToBooking = isAssignableToBooking;
    }

    public get errorMessage(): string {
        return this._errorMessage;
    }
    public set errorMessage(errorMessage: string) {
        this._errorMessage = errorMessage;
        this._isAssignableToBooking = false;
        this._fontName = AssignableRoomVM.NotAssignableFontName;
    }

    public get fontName(): string {
        return this._fontName;
    }
    public set fontName(fontName: string) {
        this._fontName = fontName;
    }

    public get roomName(): string {
        return this._roomVM.room.name;
    }
    public get roomCategoryName(): string {
        return this._roomVM.categoryStats.roomCategory.displayName;
    }
}