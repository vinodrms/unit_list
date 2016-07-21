import{RoomItemStatus} from '../../../../../../../../../../../services/hotel-operations/dashboard/rooms/data-objects/RoomItemInfoDO';

export class RoomDropHandlerFactory{
	public static get(roomStatus: RoomItemStatus){
		switch(roomStatus) {
			case RoomItemStatus.Free : {
				return new FreeRoomDropHandler();
			}

			case RoomItemStatus.Occupied : {
				return new OccupiedRoomDropHandler();
			}

			case RoomItemStatus.Reserved : {
				return new ReservedRoomDropHandler();
			}
			// case RoomItemStatus.OutOfService : {
			// 	return new OutOfServiceDropHandler();
			// }
		}
	}
}


export class FreeRoomDropHandler{
	public handle(arrivalItem){
		return true;
	}
}

export class OccupiedRoomDropHandler{
	public handle(arrivalItem){
		return false;
	}
}

export class ReservedRoomDropHandler{
	public handle(arrivalItem){
		return false;
	}
}

export class OutOfServiceDropHandler{
	public handle(arrivalItem){
		return false;
	}
}
