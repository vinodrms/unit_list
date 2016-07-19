import {RoomItemInfoDO, RoomItemStatus} from '../data-objects/RoomItemInfoDO';
import {RoomVM} from '../../../../rooms/view-models/RoomVM';

import {RoomMaintenanceStatus} from '../../../../rooms/data-objects/RoomDO';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class RoomItemInfoVM_UI_Properties{
    constructor(
        public tickBorder: boolean,
        public ghost: boolean,
        public acceptDrop: boolean){
    }
}

export class RoomItemInfoVM {
    private _roomItemDO: RoomItemInfoDO;
    private _roomVM: RoomVM;
    private _UI : RoomItemInfoVM_UI_Properties;

    constructor(
        private _thTranslation: ThTranslation 
    ) {
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

    public get status() : RoomItemStatus {
        return this.roomItemDO.roomStatus
    }

    public get categoryLabel() : string {
        return this.roomVM.categoryStats.roomCategory.displayName;
    }

    public get name() : string {
        return this.roomVM.room.name;
    }

    public get maintenanceStatus() : RoomMaintenanceStatus {
        return this.roomVM.room.maintenanceStatus;
    }

    public get customerName() : string {
        return this.roomItemDO.customerName
    }

    public get numberOfPeople() : number {
        return this.roomItemDO.bookingCapacity.noAdults + this.roomItemDO.bookingCapacity.noChildren;
    }

    public get numberOfNights() : number {
        return this.roomItemDO.bookingInterval.getNumberOfDays();
    }

    public get arrivalLabel() : string {
        return this.roomItemDO.bookingInterval.start.getShortDisplayString(this._thTranslation);
    }

    public get departureLabel() : string {
        return this.roomItemDO.bookingInterval.end.getShortDisplayString(this._thTranslation);
    }

    public get UI() : RoomItemInfoVM_UI_Properties {
        return this._UI;
    }
    
    public set UI(v : RoomItemInfoVM_UI_Properties) {
        this._UI = v;
    }
    
}