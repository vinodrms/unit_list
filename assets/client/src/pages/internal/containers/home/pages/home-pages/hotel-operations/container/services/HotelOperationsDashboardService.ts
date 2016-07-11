import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

import {RoomStatusType} from '../shared/RoomStatusType';


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

	constructor(){
		var roomsDay0 = [
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "501",
					Booking: {
						ClientName: "Allan Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16",
					}
				}
			},
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "502",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Robert Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "503",
					MaintenanceStatus: "Dirty",
					Booking: {
						ClientName: "Robert Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "504",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Paul Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Paul Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "OutOfService",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Paul Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Reserved",
				Type: "Single",
				Properties: {
					Name: "505",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Paul Paulsen",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			}			
		];
		var roomsDay1 = [
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "501",
					Booking: {
						ClientName: "Aaaaaaaaaaaa",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16",
					}
				}
			},
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "502",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "BBbbbbbbbbbb",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "503",
					MaintenanceStatus: "Dirty",
					Booking: {
						ClientName: "Ccccccccccc",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "504",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Ddddddddddd",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Eeeeeeeeeeee",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "OutOfService",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Fffffffffffff",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Reserved",
				Type: "Single",
				Properties: {
					Name: "505",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Gggggggggggggggg",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			}			
		];

		var roomsDay2 = [
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "501",
					Booking: {
						ClientName: "Hhhhhhhhhhhhhhhhhh",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16",
					}
				}
			},
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "502",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Iiiiiiiiiiiiiiiiiiii",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "503",
					MaintenanceStatus: "Dirty",
					Booking: {
						ClientName: "Jjjjjjjjjjjjjjjjjjjjj",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "504",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Kkkkkkkkkkkkkkkkkkk",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Lllllllllllllllllllll",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "OutOfService",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "MMmmmmmmmmmmmmmm",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Reserved",
				Type: "Single",
				Properties: {
					Name: "505",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Nnnnnnnnnnnnnnnnnn",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 14.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			}			
		];

		this._roomsList = [roomsDay0, roomsDay1, roomsDay2];
		this._rooms = [
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "501",
					Booking: {
						ClientName: "Tudor Nechifor",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16",
					}
				}
			},
			{
				Status: "Occupied",
				Type: "Double",
				Properties: {
					Name: "502",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Adrian Potcovaru",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "503",
					MaintenanceStatus: "Dirty",
					Booking: {
						ClientName: "Iiiiiiiiiiiiiiii",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "504",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "Jjjjjjjjjjjjjj",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Free",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Kkkkkkkkkkkkkkk",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "OutOfService",
				Type: "Double",
				Properties: {
					Name: "505",
					Booking: {
						ClientName: "Lllllllllllll",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			},
			{
				Status: "Reserved",
				Type: "Single",
				Properties: {
					Name: "505",
					MaintenanceStatus: "PickUp",
					Booking: {
						ClientName: "MMMMMMMmmmmmmmm",
						NumberOfPeople: 2,
						NumberOfNights: 7,
						Arrival: "Wed 13.02.16",
						Departure: "Sat 17.02.16"
					}
				}
			}			
		];

		var arrivalsDay0 = [
			{
				ClientName: "Robert Paulsen",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 20.02.16",
			},
			{
				ClientName: "John Snow",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 18.02.16",
			},		
			{
				ClientName: "Erika Einstein",
				NumberOfPeople: 2,
				NumberOfNights: 6,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 19.02.16",
			},
			{
				ClientName: "Dragos Pricope",
				NumberOfPeople: 1,
				NumberOfNights: 3,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 16.02.16",
			}
		];

		var arrivalsDay1 = [
			{
				ClientName: "Aaaaa",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 14.02.16",
				Departure: "Sat 20.02.16",
			},
			{
				ClientName: "Bbbbb",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 14.02.16",
				Departure: "Sat 18.02.16",
			}
		];

		var arrivalsDay2 = [
			{
				ClientName: "Cccccc",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 20.02.16",
			},
			{
				ClientName: "DDDddddd",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 18.02.16",
			},
			{
				ClientName: "EEEeeeeee",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 18.02.16",
			}			
		];

		this._arrivalsList = [arrivalsDay0, arrivalsDay1, arrivalsDay2];

		this._arrivals = [
			{
				ClientName: "Robert Paulsen",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 20.02.16",
			},
			{
				ClientName: "John Snow",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 18.02.16",
			},		
			{
				ClientName: "Erika Einstein",
				NumberOfPeople: 2,
				NumberOfNights: 6,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 19.02.16",
			},
			{
				ClientName: "Dragos Pricope",
				NumberOfPeople: 1,
				NumberOfNights: 3,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 16.02.16",
			}
		];


		var departureDay0 = [
			{
				ClientName: "Robert Paulsen",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 20.02.16",
			},
			{
				ClientName: "John Snow",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 18.02.16",
			},		
			{
				ClientName: "Erika Einstein",
				NumberOfPeople: 2,
				NumberOfNights: 6,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 19.02.16",
			},
			{
				ClientName: "Dragos Pricope",
				NumberOfPeople: 1,
				NumberOfNights: 3,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 16.02.16",
			}
		];
		var departureDay1 = [
			{
				ClientName: "HHHHH",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 14.02.16",
				Departure: "Sat 20.02.16",
			}
		];
		var departureDay2 = [
			{
				ClientName: "Uuuuuuuuuuuuuu",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 15.02.16",
				Departure: "Sat 20.02.16",
			},
			{
				ClientName: "Tttttttttttt",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 15.02.16",
				Departure: "Sat 18.02.16",
			}
		];

		this._departuresList = [departureDay0, departureDay1, departureDay2];

		this._departures = [
			{
				ClientName: "Robert Paulsen",
				NumberOfPeople: 2,
				NumberOfNights: 7,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 20.02.16",
			},
			{
				ClientName: "John Snow",
				NumberOfPeople: 2,
				NumberOfNights: 5,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 18.02.16",
			},		
			{
				ClientName: "Erika Einstein",
				NumberOfPeople: 2,
				NumberOfNights: 6,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 19.02.16",
			},
			{
				ClientName: "Dragos Pricope",
				NumberOfPeople: 1,
				NumberOfNights: 3,
				Arrival: "Wed 13.02.16",
				Departure: "Sat 16.02.16",
			}
		]
	}

	public getRooms(roomState, date){
		var p = new Promise((resolve, reject) => {
			setTimeout(() => {
				var allRooms = this._roomsList[date];
				if (roomState == 'All'){
					resolve(allRooms);
				}
				else {
					var filteredResults = this.filterRoomsByStateType(roomState, allRooms);
					resolve(filteredResults);
				}
			}, 1000);
		});
		return p;
	}

	private filterRoomsByStateType(roomStatus, rooms):any{
		var rooms = _.filter(rooms, function(room){ return room.Status == roomStatus; });
		return rooms;
	}

	public checkIn(bookingId, roomId){
		// var p = new Promise((resolve, reject) => {
		// 	resolve(this._rooms);
		// });
		// return p;
	}

	public checkOut(roomId){
		// var p = new Promise((resolve, reject) => {
		// 	resolve(this._rooms);
		// });
		// return p;
	}

	public getArrivals(date){
		var p = new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(this._arrivalsList[date]);
			}, 1000);
			
		});
		return p;
	}

	public getDepartures(date){
		var p = new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(this._departuresList[date]);
			}, 1000);
			
		});
		return p;
	}
}