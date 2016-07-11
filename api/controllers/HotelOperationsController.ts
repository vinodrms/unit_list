import {ThLogger, ThLogLevel} from '../core/utils/logging/ThLogger';
import {ThError} from '../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../core/utils/th-responses/ThResponse';
import {IImageStorageService} from '../core/services/image-storage/IImageStorageService';
import {BaseController} from './base/BaseController';
import {AppContext} from '../core/utils/AppContext';
import {IVatProvider, VatDetailsDO} from '../core/services/vat/IVatProvider';
import {ITimeZonesService, TimeZoneDO} from '../core/services/time-zones/ITimeZonesService';

class HotelOperationsController extends BaseController {
	private _roomsList;
	private _arrivalsList;
	private _departuresList;

	private _rooms;
	private _arrivals;
	private _departures;

	constructor(){
        super();
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
					Name: "503",
					MaintenanceStatus: "Dirty",
					Booking: {
						ClientName: "Robert Paulsen Catalin Andrei",
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
					MaintenanceStatus: "Dirty",
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

    public getRooms(req: Express.Request, res: Express.Response){
        if (!this.precheckGETParameters(req, res, ['state', 'date'])) { return };
		var state = req.query.state;
        var date = req.query.date;

        var allRooms = this._roomsList[date];
        //TODO: Build enum
        if (state == 'All'){
            // TODO: Update format to respect format
            this.returnSuccesfulResponse(req, res, allRooms);
        }
        else {
            var filteredResults = this.filterRoomsByStateType(state, allRooms);
            this.returnSuccesfulResponse(req, res, filteredResults);
        }
    }

	private filterRoomsByStateType(roomStatus, rooms:any[]):any{
		var filteredRooms = _.filter(rooms, function(room){ return room.Status == status; });
		return filteredRooms;
	}    

    public getArrivals(req: Express.Request, res: Express.Response){
        if (!this.precheckGETParameters(req, res, ['date'])) { return };
        var date = req.query.date;
        this.returnSuccesfulResponse(req, res, this._arrivalsList[date]);

    }
    public getDepartures(req: Express.Request, res: Express.Response){
        if (!this.precheckGETParameters(req, res, ['date'])) { return };
        var date = req.query.date;
        this.returnSuccesfulResponse(req, res, this._arrivalsList[date]);

    }

    public getCheckIn(req: Express.Request, res: Express.Response){
        throw "Not Implemented";
    }
    public getCheckOut(req: Express.Request, res: Express.Response){
        throw "Not Implemented";
    }
}

var hotelOperationsController = new HotelOperationsController();
module.exports = {
	getRooms: hotelOperationsController.getRooms.bind(hotelOperationsController),
	getArrivals: hotelOperationsController.getArrivals.bind(hotelOperationsController),
	getDepartures: hotelOperationsController.getDepartures.bind(hotelOperationsController),
	getCheckIn: hotelOperationsController.getCheckIn.bind(hotelOperationsController),
	getCheckOut: hotelOperationsController.getCheckOut.bind(hotelOperationsController)
}


