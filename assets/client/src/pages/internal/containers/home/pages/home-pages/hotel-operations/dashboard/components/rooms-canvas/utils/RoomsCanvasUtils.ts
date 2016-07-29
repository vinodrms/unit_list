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

		switch (filterType) {
			case FilterValueType.All:
				properties = {
					cssColor: 'green',
					textFirstPart: 'SHOWING ',
					textSecondPart: 'ALL ROOMS'
				}
			case FilterValueType.Free:
				properties = {
					cssColor: 'green',
					textFirstPart: 'SHOWING ONLY ',
					textSecondPart: 'FREE ROOMS'
				}
				break;
			case FilterValueType.Occupied:
				properties = {
					cssColor: 'orange',
					textFirstPart: 'SHOWING ONLY ',
					textSecondPart: 'OCCUPIED ROOMS'
				}
				break;
			case FilterValueType.Reserved:
				properties = {
					cssColor: 'yellow',
					textFirstPart: 'SHOWING ONLY ',
					textSecondPart: 'RESERVED ROOMS'
				}
				break;
			case FilterValueType.OutOfService:
				properties = {
					cssColor: 'dark-gray',
					textFirstPart: 'SHOWING ONLY ',
					textSecondPart: 'OUT OF SERVICE ROOMS'
				}
				break;
			default:
				properties = {
					cssColor: 'green',
					textFirstPart: 'SHOWING ',
					textSecondPart: 'ALL ROOMS'
				}
				break;
		}
		return properties;
	}

	public filterRoomsByStateType(filterType: FilterValueType, rooms:RoomItemInfoVM[]):any{
		if (filterType != FilterValueType.All){
			var filteredRooms = _.filter(rooms, function(room:RoomItemInfoVM){
				switch (filterType) {
					case FilterValueType.Free:
						return room.isFree();
					case FilterValueType.Occupied:
						return room.isOccupied();
					case FilterValueType.Reserved:
						return room.isReserved();
					case FilterValueType.OutOfService:
						return room.isOutOfService();
					default:
						return false;
				}
			});
			return filteredRooms;
		}
		
		return rooms;
	}

	public setRoomsUIHighlight(rooms: RoomItemInfoVM[], value:RoomItemInfoVM_UI_Properties) {
		rooms.forEach(room => {
			room.UI.tickBorder = value.tickBorder;
			room.UI.ghost = value.ghost;
			room.UI.acceptDrop = value.acceptDrop;
		});
	}	
}