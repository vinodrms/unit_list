import {RoomItemInfoDO} from '../data-objects/RoomItemInfoDO';
import {RoomVM} from '../../../../rooms/view-models/RoomVM';

export class RoomItemInfoVM {
    private _roomItemDO: RoomItemInfoDO;
    private _roomVM: RoomVM;

    constructor() {
    }

    public get roomItemDO(): RoomItemInfoDO {
        return this._roomItemDO;
    }
    public set roomItemDO(roomItemDO: RoomItemInfoDO) {
        this._roomItemDO = roomItemDO;
    }
    public get roomVM(): RoomVM {
        return this._roomVM;
    }
    public set roomVM(roomVM: RoomVM) {
        this._roomVM = roomVM;
    }
}