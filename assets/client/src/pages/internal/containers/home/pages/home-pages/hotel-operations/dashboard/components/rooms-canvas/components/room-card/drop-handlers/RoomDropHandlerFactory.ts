import {ArrivalItemInfoVM} from '../../../../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';

import {RoomItemInfoVM, RoomItemInfoVM_UI_Properties} from '../../../../../../../../../../../services/hotel-operations/dashboard/rooms/view-models/RoomItemInfoVM';
import {RoomItemInfoDO, RoomItemStatus} from '../../../../../../../../../../../services/hotel-operations/dashboard/rooms/data-objects/RoomItemInfoDO';


export class RoomDropHandlerFactory{
	public static get(room: RoomItemInfoVM): IDropHandler{
		if (room.isFree()){
			return new FreeRoomDropHandler(room);
		}
		if (room.isOccupied()){
			return new OccupiedRoomDropHandler(room);
		}
		if (room.isReserved()){
			return new ReservedRoomDropHandler(room);
		}
		if (room.isOutOfService()){
			return new OutOfServiceDropHandler(room);
		}
		if (room.isOutOfOrder()){
			return new OutOfOrderDropHandler(room);
		}
	}
}

export interface IDropHandler{
	handle(arrivalItem:ArrivalItemInfoVM):boolean;
}

export class FreeRoomDropHandler implements IDropHandler{
	constructor(private room:RoomItemInfoVM){
	}
	
	public handle(arrivalItem:ArrivalItemInfoVM):boolean{
		if (arrivalItem){
			return this.room.canCheckIn(arrivalItem) || this.room.canUpgrade(arrivalItem);
		}
		return false;
	}
}

export class OccupiedRoomDropHandler implements IDropHandler{
	constructor(private room:RoomItemInfoVM){
	}

	public handle(arrivalItem:ArrivalItemInfoVM):boolean{
		return false;
	}
}

export class ReservedRoomDropHandler implements IDropHandler{
	constructor(private room:RoomItemInfoVM){
	}

	public handle(arrivalItem:ArrivalItemInfoVM):boolean{
		if (arrivalItem){
			return this.room.canCheckIn(arrivalItem);
		}
		return false;
	}
}

export class OutOfServiceDropHandler implements IDropHandler{
	constructor(private room:RoomItemInfoVM){
	}

	public handle(arrivalItem:ArrivalItemInfoVM):boolean{
		return false;
	}
}
export class OutOfOrderDropHandler implements IDropHandler{
	constructor(private room:RoomItemInfoVM){
	}

	public handle(arrivalItem:ArrivalItemInfoVM):boolean{
		return false;
	}
}