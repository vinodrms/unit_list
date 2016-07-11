import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import {AppContext, ThError} from '../../../../../../../../../common/utils/AppContext';
import {RoomStatusType} from '../shared/RoomStatusType';

import {ThServerApi} from '../../../../../../../../../common/utils/http/ThServerApi';

declare var $: any;
declare var _: any;

@Injectable()
export class HotelOperationsDashboardService{
	private _roomsList;
	private _arrivalsList;
	private _departuresList;

	private _rooms;
	private _arrivals;
	private _departures;

	constructor(private _appContext: AppContext){
	}

	public getRooms(roomState, date){
		return this._appContext.thHttp.get(ThServerApi.HotelOperationsRooms, { state: roomState, date: date });
	}

	private filterRoomsByStateType(roomStatus, rooms):any{
		var rooms = _.filter(rooms, function(room){ return room.Status == roomStatus; });
		return rooms;
	}

	public checkIn(bookingId, roomId){
	}

	public checkOut(roomId){
	}

	public getArrivals(date){
		return this._appContext.thHttp.get(ThServerApi.HotelOperationsArrivals, { date: date });
	}

	public getDepartures(date){
		return this._appContext.thHttp.get(ThServerApi.HotelOperationsDepartures, { date: date });
		
	}
}