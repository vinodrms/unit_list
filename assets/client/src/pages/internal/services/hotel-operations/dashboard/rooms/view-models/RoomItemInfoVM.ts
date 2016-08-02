import {ArrivalItemInfoVM} from '../../arrivals/view-models/ArrivalItemInfoVM';

import {RoomItemInfoDO, RoomItemStatus} from '../data-objects/RoomItemInfoDO';
import {RoomVM} from '../../../../rooms/view-models/RoomVM';

import {RoomMaintenanceStatus} from '../../../../rooms/data-objects/RoomDO';
import {ThTranslation} from '../../../../../../../common/utils/localization/ThTranslation';

import {ConfigCapacityDO} from '../../../../common/data-objects/bed-config/ConfigCapacityDO';

export class RoomItemInfoVM_UI_Properties{
    constructor(
        public tickBorder: boolean,
        public ghost: boolean,
        public highlightForDrop: boolean){
    }
}

export class RoomItemInfoVM {
    private _roomItemDO: RoomItemInfoDO;
    private _roomVM: RoomVM;
    private _UI : RoomItemInfoVM_UI_Properties;

    constructor(
        private _thTranslation: ThTranslation
    ) {
        this._UI = new RoomItemInfoVM_UI_Properties(false,false,false);
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

    public canFit(capacityToCheck: ConfigCapacityDO){
        return this.roomVM.categoryStats.capacity.canFit(capacityToCheck);
    }

    public get UI() : RoomItemInfoVM_UI_Properties {
        return this._UI;
    }

    public isFree(): boolean {
        if (this.maintenanceStatus != RoomMaintenanceStatus.OutOfService &&
            this._roomItemDO.roomStatus == RoomItemStatus.Free ) {
            return true;
        }
        return false;
    }

    public isOccupied(): boolean {
        if (this.maintenanceStatus != RoomMaintenanceStatus.OutOfService &&
            this._roomItemDO.roomStatus == RoomItemStatus.Occupied ) {
            return true;
        }
        return false;
    }

    public isReserved(): boolean {
        if (this.maintenanceStatus != RoomMaintenanceStatus.OutOfService &&
            this._roomItemDO.roomStatus == RoomItemStatus.Reserved ) {
            return true;
        }
        return false;
    }

    public isOutOfService(): boolean {
        if (this.maintenanceStatus == RoomMaintenanceStatus.OutOfService) {
            return true;
        }
        return false;
    }

	public canCheckIn( arrivalItem: ArrivalItemInfoVM){
		if (this.isFree()){
            if (
                this.canFit(arrivalItem.bookingCapacity) &&
                this.roomVM.category.id == arrivalItem.reservedRoomCategoryStats.roomCategory.id
            ){
                return true;
            }
        }
        else if (this.isReserved()){
            if (
                this.canFit(arrivalItem.bookingCapacity) &&
                arrivalItem.hasReservedRoom &&
                arrivalItem.reservedRoomVM.room.name &&
                this.roomVM.category.id == arrivalItem.reservedRoomCategoryStats.roomCategory.id &&
                this._roomItemDO.bookingId == arrivalItem.arrivalItemDO.bookingId
            ){
                return true;
            }
        }

		return false;
	}

	public canUpgrade( arrivalItem: ArrivalItemInfoVM){
		if (
			this.canFit(arrivalItem.bookingCapacity) &&
			this.isFree()
		){
			return true;
		}
		return false;
	}    
    
    public set UI(v : RoomItemInfoVM_UI_Properties) {
        this._UI = v;
    }    
}