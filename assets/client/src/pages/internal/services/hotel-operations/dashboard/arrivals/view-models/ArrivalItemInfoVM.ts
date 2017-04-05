import {ArrivalItemInfoDO} from '../data-objects/ArrivalItemInfoDO';
import {RoomVM} from '../../../../rooms/view-models/RoomVM';
import {RoomCategoryStatsDO} from '../../../../room-categories/data-objects/RoomCategoryStatsDO';

import {ConfigCapacityDO} from '../../../../common/data-objects/bed-config/ConfigCapacityDO';

import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

export class ArrivalItemInfoVM {
    private _arrivalItemDO: ArrivalItemInfoDO;
    private _reservedRoomCategoryStats: RoomCategoryStatsDO;
    private _hasReservedRoom: boolean;
    private _reservedRoomVM: RoomVM;
    

    constructor(private _thTranslation: ThTranslation) {
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

    public get customerName():string{
        return this.arrivalItemDO.customerName;
    }

    public get roomCategoryLabel() : string {
        return this._reservedRoomCategoryStats.roomCategory.displayName;
    }

    public get numberOfPeople() : number {
        return this.arrivalItemDO.bookingCapacity.noAdults + this.arrivalItemDO.bookingCapacity.noChildren; 
    }

    public get numberOfNights() : number {
        return this.arrivalItemDO.bookingInterval.getNumberOfDays();
    }

    public get arrivalLabel() : string {
        return this.arrivalItemDO.bookingInterval.start.getShortDisplayString(this._thTranslation) 
    }

    public get departureLabel() : string {
        return this.arrivalItemDO.bookingInterval.end.getShortDisplayString(this._thTranslation) 
    }

    
    public get bookingCapacity() : ConfigCapacityDO {
        return this.arrivalItemDO.bookingCapacity;
    }
}