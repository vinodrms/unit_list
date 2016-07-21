import {Injectable} from '@angular/core';

import {RoomItemInfoDO, RoomItemStatus} from '../../../../../../../../../services/hotel-operations/dashboard/rooms/data-objects/RoomItemInfoDO';

import {RoomItemInfoVM, RoomItemInfoVM_UI_Properties} from '../../../../../../../../../services/hotel-operations/dashboard/rooms/view-models/RoomItemInfoVM';

import {FilterValueType, IDragStyles, IFilterNotificationProperties, IFilterNotification, IFilterValue} from './RoomsCanvasInterfaces';

@Injectable()
export class RoomsCanvasUtils{
	public get dragStyles(): IDragStyles{
		var dragStyles = {
			canCheckIn : new RoomItemInfoVM_UI_Properties(true, false, true),
			canUpgrade : new RoomItemInfoVM_UI_Properties(false,true,true),
			canNotCheckIn : new RoomItemInfoVM_UI_Properties(false,true,false),
			default: new RoomItemInfoVM_UI_Properties(false,false,false)
		}
		
		return dragStyles;
	}

	public getfilterNotificationProperties(filterType: FilterValueType):IFilterNotificationProperties{
		var properties: IFilterNotificationProperties;
		if (filterType == FilterValueType.All){
			properties = {
				cssColor: 'green',
				textFirstPart: 'SHOWING ',
				textSecondPart: 'ALL ROOMS'
			}
		}
		else {
			var statusType = this.getMappedRoomItemStatusFromFilter(filterType);
			switch (statusType) {
				case RoomItemStatus.Free:
					properties = {
						cssColor: 'green',
						textFirstPart: 'SHOWING ONLY ',
						textSecondPart: 'FREE ROOMS'
					}
					break;
				case RoomItemStatus.Occupied:
					properties = {
						cssColor: 'orange',
						textFirstPart: 'SHOWING ONLY ',
						textSecondPart: 'OCCUPIED ROOMS'
					}
					break;
				case RoomItemStatus.Reserved:
					properties = {
						cssColor: 'yellow',
						textFirstPart: 'SHOWING ONLY ',
						textSecondPart: 'RESERVED ROOMS'
					}
					break;
				// case RoomStatusType.OutOfService:
				// 	properties = {
				// 		cssColor: 'gray',
				// 		textFirstPart: 'SHOWING ONLY ',
				// 		textSecondPart: 'OUT OF SERVICE ROOMS'
				// 	}
				// 	break;
				default:
					properties = {
						cssColor: 'green',
						textFirstPart: 'SHOWING ',
						textSecondPart: 'ALL ROOMS'
					}
					break;
			}
		}
		return properties;
	}

	public getMappedRoomItemStatusFromFilter(filterType:FilterValueType):RoomItemStatus{
		debugger;
		var statusType;
		switch (filterType) {
			case FilterValueType.Free:
				statusType = RoomItemStatus.Free;
				break;
			case FilterValueType.Occupied:
				statusType = RoomItemStatus.Occupied;
				break;
			case FilterValueType.Reserved:
				statusType = RoomItemStatus.Reserved;
				break;
			case FilterValueType.OutOfService:
				// TODO: add out of service to RoomItemStatus
				statusType = RoomItemStatus.Free;
				break;
			default:
				statusType = RoomItemStatus.Free;
				break;
		}
		return statusType;
	}

	public filterRoomsByStateType(filterType: FilterValueType, rooms:RoomItemInfoVM[]):any{
		if (filterType != FilterValueType.All){
			var roomStatus = this.getMappedRoomItemStatusFromFilter(filterType);
			var filteredRooms = _.filter(rooms, function(room:RoomItemInfoVM){ return room.status == roomStatus; });
			return filteredRooms;
		}
		
		return rooms;
	}


	// public filterRoomsByStateType(roomStatus: RoomItemStatus, rooms:RoomItemInfoVM[]):any{
	// 	var filteredRooms = _.filter(rooms, function(room:RoomItemInfoVM){ return room.status == roomStatus; });
	// 	return filteredRooms;
	// }

	public setRoomsUIHighlight(rooms: RoomItemInfoVM[], value:RoomItemInfoVM_UI_Properties) {
		rooms.forEach(room => {
			room.UI.tickBorder = value.tickBorder;
			room.UI.ghost = value.ghost;
			room.UI.acceptDrop = value.acceptDrop;
		});
	}	
}