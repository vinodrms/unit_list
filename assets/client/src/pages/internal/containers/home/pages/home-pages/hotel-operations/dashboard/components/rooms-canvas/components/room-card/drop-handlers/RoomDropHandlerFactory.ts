import {RoomStatusType} from '../../../../../shared/RoomStatusType';

export class RoomDropHandlerFactory{
	public static get(roomStatus: RoomStatusType){
		switch(roomStatus) {
			case RoomStatusType.Free : {
				return new FreeRoomDropHandler();
			}

			case RoomStatusType.Occupied : {
				return new OccupiedRoomDropHandler();
			}

			case RoomStatusType.Reserved : {
				return new ReservedRoomDropHandler();
			}

			case RoomStatusType.OutOfService : {
				return new OutOfServiceDropHandler();
			}
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
