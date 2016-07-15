import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {AppContext, ThError} from '../../../../../../../../../common/utils/AppContext';
import {RoomStatusType} from '../shared/RoomStatusType';

import {ThServerApi} from '../../../../../../../../../common/utils/http/ThServerApi';

import {ArrivalItemVM} from '../view-models/ArrivalItemVM';
import {RoomCardVM, RoomBooking, RoomCategory, RoomProperties, RoomStatus} from '../view-models/RoomCardVM';
import {DepartureItemVM} from '../view-models/DepartureItemVM';

import {ThTranslation} from '../../../../../../../../../common/utils/localization/ThTranslation';

import {ThDateIntervalDO} from '../../../../../../../../internal/services/common/data-objects/th-dates/ThDateIntervalDO';
import {ConfigCapacityDO} from '../../../../../../../../internal/services/common/data-objects/bed-config/ConfigCapacityDO';

import {ThDateDO} from '../../../../../../../services/common/data-objects/th-dates/ThDateDO';

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

	public getRooms(roomState, date):Observable<RoomCardVM[]>{
		var room1 = new RoomCardVM(this._appContext.thTranslation);
		room1.status.value = RoomStatusType.Occupied;
		room1.roomCategory.value = "Single";
		room1.properties.name = "501";

		room1.properties.booking.config = new ConfigCapacityDO();
		room1.properties.booking.config.noAdults = 2;
		room1.properties.booking.config.noChildren = 1;
		room1.properties.booking.config.noBabies = 0;

		room1.properties.booking.clientName = "Rober Paulsen";
		room1.properties.booking.interval = new ThDateIntervalDO();
		room1.properties.booking.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
		room1.properties.booking.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);

// ============
		var room2 = new RoomCardVM(this._appContext.thTranslation);
		room2.status.value = RoomStatusType.Occupied;
		room2.roomCategory.value = "Single";
		room2.properties.name = "502";

		room2.properties.maintenanceStatus = "Dirty";
		room2.properties.booking.config = new ConfigCapacityDO();
		room2.properties.booking.config.noAdults = 2;
		room2.properties.booking.config.noChildren = 1;
		room2.properties.booking.config.noBabies = 0;

		room2.properties.booking.clientName = "Rober Paulsen";
		room2.properties.booking.interval = new ThDateIntervalDO();
		room2.properties.booking.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
		room2.properties.booking.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);
// ============
		var room3 = new RoomCardVM(this._appContext.thTranslation);
		room3.status.value = RoomStatusType.Occupied;
		room3.roomCategory.value = "Double";
		room3.properties.name = "503";

		room2.properties.maintenanceStatus = "Dirty";
		room3.properties.booking.config = new ConfigCapacityDO();
		room3.properties.booking.config.noAdults = 2;
		room3.properties.booking.config.noChildren = 1;
		room3.properties.booking.config.noBabies = 0;

		room3.properties.booking.clientName = "Rober Paulsen";
		room3.properties.booking.interval = new ThDateIntervalDO();
		room3.properties.booking.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
		room3.properties.booking.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);
// ============
		var room4 = new RoomCardVM(this._appContext.thTranslation);
		room4.status.value = RoomStatusType.Free;
		room4.roomCategory.value = "Single";
		room4.properties.name = "504";

		room4.properties.booking.config = new ConfigCapacityDO();
		room4.properties.booking.config.noAdults = 2;
		room4.properties.booking.config.noChildren = 1;
		room4.properties.booking.config.noBabies = 0;

		room4.properties.booking.clientName = "Rober Paulsen";
		room4.properties.booking.interval = new ThDateIntervalDO();
		room4.properties.booking.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
		room4.properties.booking.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);
// ============
		var room5 = new RoomCardVM(this._appContext.thTranslation);
		room5.status.value = RoomStatusType.Free;
		room5.roomCategory.value = "Double";
		room5.properties.name = "505";

		room5.properties.booking.config = new ConfigCapacityDO();
		room5.properties.booking.config.noAdults = 2;
		room5.properties.booking.config.noChildren = 1;
		room5.properties.booking.config.noBabies = 0;

		room5.properties.booking.clientName = "Rober Paulsen";
		room5.properties.booking.interval = new ThDateIntervalDO();
		room5.properties.booking.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
		room5.properties.booking.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);
// ============
		var room6 = new RoomCardVM(this._appContext.thTranslation);
		room6.status.value = RoomStatusType.OutOfService;
		room6.roomCategory.value = "Single";
		room6.properties.name = "506";

		room6.properties.booking.config = new ConfigCapacityDO();
		room6.properties.booking.config.noAdults = 2;
		room6.properties.booking.config.noChildren = 1;
		room6.properties.booking.config.noBabies = 0;

		room6.properties.booking.clientName = "Rober Paulsen";
		room6.properties.booking.interval = new ThDateIntervalDO();
		room6.properties.booking.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
		room6.properties.booking.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);
// ============
		var room7 = new RoomCardVM(this._appContext.thTranslation);
		room7.status.value = RoomStatusType.Reserved;
		room7.roomCategory.value = "Single";
		room7.properties.name = "507";

		room7.properties.booking.config = new ConfigCapacityDO();
		room7.properties.booking.config.noAdults = 2;
		room7.properties.booking.config.noChildren = 1;
		room7.properties.booking.config.noBabies = 0;

		room7.properties.booking.clientName = "Rober Paulsen";
		room7.properties.booking.interval = new ThDateIntervalDO();
		room7.properties.booking.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
		room7.properties.booking.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);

		return Observable.of([room1, room2, room3, room4, room5, room6, room7]);
	}

	private filterRoomsByStateType(roomStatus, rooms):any{
		var rooms = _.filter(rooms, function(room){ return room.Status == roomStatus; });
		return rooms;
	}

	public checkIn(bookingId, roomId){
	}

	public checkOut(roomId){
	}

	public getArrivals(date):Observable<ArrivalItemVM[]>{
		var arrival1 = new ArrivalItemVM(this._appContext.thTranslation);
		arrival1.clientName = "Dragos Eduard";

		arrival1.config = new ConfigCapacityDO();
		arrival1.config.noAdults = 2;
		arrival1.config.noChildren = 0;
		arrival1.config.noBabies = 0;

		arrival1.interval = new ThDateIntervalDO();
		arrival1.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
		arrival1.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);

		arrival1.roomType = "Single";

		var arrival2 = new ArrivalItemVM(this._appContext.thTranslation);
		arrival2.clientName = "Ion Paraschiv";

		arrival2.config = new ConfigCapacityDO();
		arrival2.config.noAdults = 2;
		arrival2.config.noChildren = 1;
		arrival2.config.noBabies = 0;

		arrival2.interval = new ThDateIntervalDO();
		arrival2.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
		arrival2.interval.end = ThDateDO.buildThDateDO(2016, 11, 11);

		arrival2.roomType = "Double";
		
		var arrivals = [ arrival1, arrival2];
		return Observable.of(arrivals);
	}

	public getDepartures(date){

			var departure1 = new DepartureItemVM(this._appContext.thTranslation);
			departure1.clientName = "Buruiana Filip";
			departure1.roomName = "502";

			departure1.config = new ConfigCapacityDO();
			departure1.config.noAdults = 2;
			departure1.config.noChildren = 0;
			departure1.config.noBabies = 0;

			departure1.interval = new ThDateIntervalDO();
			departure1.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
			departure1.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);

			var departure2 = new DepartureItemVM(this._appContext.thTranslation);
			departure2.clientName = "Silvia Patan";
			departure2.roomName = "503";

			departure2.config = new ConfigCapacityDO();
			departure2.config.noAdults = 1;
			departure2.config.noChildren = 0;
			departure2.config.noBabies = 0;

			departure2.interval = new ThDateIntervalDO();
			departure2.interval.start = ThDateDO.buildThDateDO(2016, 11, 1);
			departure2.interval.end = ThDateDO.buildThDateDO(2016, 11, 7);
			return Observable.of([departure1, departure2]);
	}
}