import {Injectable} from '@angular/core';

import {RoomItemInfoDO, RoomItemStatus} from '../../../../../../../../../services/hotel-operations/dashboard/rooms/data-objects/RoomItemInfoDO';

import {RoomItemInfoVM, RoomItemInfoVM_UI_Properties} from '../../../../../../../../../services/hotel-operations/dashboard/rooms/view-models/RoomItemInfoVM';

import {FilterValueType, IDragStyles, IFilterNotificationProperties, IFilterNotification, IFilterValue} from './RoomsCanvasInterfaces';

import {ThTranslation} from '../../../../../../../../../../../common/utils/localization/ThTranslation';

@Injectable()
export class RoomsCanvasUtils{
	public get dragStyles(): IDragStyles{
		var dragStyles = {
			canCheckIn : new RoomItemInfoVM_UI_Properties(true, false, true),
			canUpgrade : new RoomItemInfoVM_UI_Properties(false,true,false),
			canNotCheckIn : new RoomItemInfoVM_UI_Properties(false,true,false),
			default: new RoomItemInfoVM_UI_Properties(false,false,false)
		}
		
		return dragStyles;
	}

	public getfilterNotificationProperties(filterType: FilterValueType, translator: ThTranslation):IFilterNotificationProperties{
		var properties: IFilterNotificationProperties;
		switch (filterType) {
			case FilterValueType.All:
				properties = {
					cssColor: 'green',
					textFirstPart: translator.translate('Showing').toUpperCase(),
					textSecondPart: translator.translate('All Rooms').toUpperCase()
				}
			case FilterValueType.Free:
				properties = {
					cssColor: 'green',
					textFirstPart: translator.translate('Showing Only').toUpperCase(),
					textSecondPart: translator.translate('Free Rooms').toUpperCase()
				}
				break;
			case FilterValueType.Occupied:
				properties = {
					cssColor: 'orange',
					textFirstPart: translator.translate('Showing Only').toUpperCase(),
					textSecondPart: translator.translate('Occupied Rooms').toUpperCase()
				}
				break;
			case FilterValueType.Reserved:
				properties = {
					cssColor: 'yellow',
					textFirstPart: translator.translate('Showing Only').toUpperCase(),
					textSecondPart: translator.translate('Reserved Rooms').toUpperCase()
				}
				break;
			case FilterValueType.OutOfService:
				properties = {
					cssColor: 'dark-gray',
					textFirstPart: translator.translate('Showing Only').toUpperCase(),
					textSecondPart: translator.translate('Out Of Service Rooms').toUpperCase()
				}
				break;
			default:
				properties = {
					cssColor: 'green',
					textFirstPart: translator.translate('Showing').toUpperCase(),
					textSecondPart: translator.translate('All Rooms').toUpperCase()
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
			room.UI.highlightForDrop = value.highlightForDrop;
		});
	}	
}