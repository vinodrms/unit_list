import {ArrivalItemInfoVM} from '../../../../../../../../../../../services/hotel-operations/dashboard/arrivals/view-models/ArrivalItemInfoVM';

import {RoomItemInfoVM, RoomItemInfoVM_UI_Properties} from '../../../../../../../../../../../services/hotel-operations/dashboard/rooms/view-models/RoomItemInfoVM';
import {RoomItemInfoDO, RoomItemStatus} from '../../../../../../../../../../../services/hotel-operations/dashboard/rooms/data-objects/RoomItemInfoDO';


export class RoomDropHandlerFactory{
	public static get(room: RoomItemInfoVM){
		if (room.isFree){
			return new FreeRoomDropHandler(room);
		}
		if (room.isOccupied){
			return new FreeRoomDropHandler(room);
		}
		if (room.isReserved){
			return new FreeRoomDropHandler(room);
		}
		if (room.isOutOfService){
			return new FreeRoomDropHandler(room);
		}
	}
}


export class FreeRoomDropHandler{
	constructor(private room:RoomItemInfoVM){
	}
	
	public handle(arrivalItem:ArrivalItemInfoVM){
		if (
			this.room.canFit(arrivalItem.bookingCapacity) &&
			this.room.isFree()
		){
			return true;
		}
		return false;
	}
}

export class OccupiedRoomDropHandler{
	constructor(private room:RoomItemInfoVM){
	}

	public handle(arrivalItem:ArrivalItemInfoVM){
		return false;
	}
}

export class ReservedRoomDropHandler{
	constructor(private room:RoomItemInfoVM){
	}

	public handle(arrivalItem:ArrivalItemInfoVM){
		if (
			this.room.canFit(arrivalItem.bookingCapacity) &&
			this.room.isFree() &&
			this.room.roomItemDO.bookingId == arrivalItem.arrivalItemDO.bookingId
		){
			return true;
		}
		return false;
	}
}

export class OutOfServiceDropHandler{
	constructor(private room:RoomItemInfoVM){
	}

	public handle(arrivalItem:ArrivalItemInfoVM){
		return false;
	}
}
