import {ArrivalItemInfoDO} from '../data-objects/ArrivalItemInfoDO';
import {RoomVM} from '../../../../rooms/view-models/RoomVM';
import {RoomCategoryStatsDO} from '../../../../room-categories/data-objects/RoomCategoryStatsDO';

export class ArrivalItemInfoVM {
    private _arrivalItemDO: ArrivalItemInfoDO;
    private _reservedRoomCategoryStats: RoomCategoryStatsDO;
    private _hasReservedRoom: boolean;
    private _reservedRoomVM: RoomVM;

    constructor() {
    }

    public get arrivalItemDO(): ArrivalItemInfoDO {
        return this._arrivalItemDO;
    }
    public set arrivalItemDO(arrivalItemDO: ArrivalItemInfoDO) {
        this._arrivalItemDO = arrivalItemDO;
    }

    public get reservedRoomCategoryStats(): RoomCategoryStatsDO {
        return this._reservedRoomCategoryStats;
    }
    public set reservedRoomCategoryStats(reservedRoomCategoryStats: RoomCategoryStatsDO) {
        this._reservedRoomCategoryStats = reservedRoomCategoryStats;
    }

    public get hasReservedRoom(): boolean {
        return this._hasReservedRoom;
    }
    public set hasReservedRoom(hasReservedRoom: boolean) {
        this._hasReservedRoom = hasReservedRoom;
    }

    public get reservedRoomVM(): RoomVM {
        return this._reservedRoomVM;
    }
    public set reservedRoomVM(reservedRoomVM: RoomVM) {
        this._reservedRoomVM = reservedRoomVM;
    }
}