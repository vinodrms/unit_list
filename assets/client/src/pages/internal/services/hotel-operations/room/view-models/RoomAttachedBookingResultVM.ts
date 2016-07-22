import {RoomAttachedBookingResultDO} from '../data-objects/RoomAttachedBookingResultDO';
import {CustomersDO} from '../../../customers/data-objects/CustomersDO';

export class RoomAttachedBookingResultVM {
    private _roomAttachedBookingResultDO: RoomAttachedBookingResultDO;
    private _customersContainer: CustomersDO;

    public get roomAttachedBookingResultDO(): RoomAttachedBookingResultDO {
        return this._roomAttachedBookingResultDO;
    }
    public set roomAttachedBookingResultDO(roomAttachedBookingResultDO: RoomAttachedBookingResultDO) {
        this._roomAttachedBookingResultDO = roomAttachedBookingResultDO;
    }

    public get customersContainer(): CustomersDO {
        return this._customersContainer;
    }
    public set customersContainer(customersContainer: CustomersDO) {
        this._customersContainer = customersContainer;
    }
}