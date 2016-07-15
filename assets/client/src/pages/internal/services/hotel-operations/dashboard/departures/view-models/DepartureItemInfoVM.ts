import {DepartureItemInfoDO} from '../data-objects/DepartureItemInfoDO';
import {RoomVM} from '../../../../rooms/view-models/RoomVM';

export class DepartureItemInfoVM {
    private _departureItemDO: DepartureItemInfoDO;
    private _hasInvoice: boolean;
    private _hasBooking: boolean;
    private _isStayingInRoom: boolean;
    private _stayingRoomVM: RoomVM;

    constructor() {
    }

    public get departureItemDO(): DepartureItemInfoDO {
        return this._departureItemDO;
    }
    public set departureItemDO(departureItemDO: DepartureItemInfoDO) {
        this._departureItemDO = departureItemDO;
    }
    public get hasInvoice(): boolean {
        return this._hasInvoice;
    }
    public set hasInvoice(hasInvoice: boolean) {
        this._hasInvoice = hasInvoice;
    }
    public get hasBooking(): boolean {
        return this._hasBooking;
    }
    public set hasBooking(hasBooking: boolean) {
        this._hasBooking = hasBooking;
    }
    public get isStayingInRoom(): boolean {
        return this._isStayingInRoom;
    }
    public set isStayingInRoom(isStayingInRoom: boolean) {
        this._isStayingInRoom = isStayingInRoom;
    }
    public get stayingRoomVM(): RoomVM {
        return this._stayingRoomVM;
    }
    public set stayingRoomVM(stayingRoomVM: RoomVM) {
        this._stayingRoomVM = stayingRoomVM;
    }
}