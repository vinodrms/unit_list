import {ThLogger, ThLogLevel} from '../core/utils/logging/ThLogger';
import {ThError} from '../core/utils/th-responses/ThError';
import {ThStatusCode, ThResponse} from '../core/utils/th-responses/ThResponse';
import {IImageStorageService} from '../core/services/image-storage/IImageStorageService';
import {BaseController} from './base/BaseController';
import {AppContext} from '../core/utils/AppContext';
import {IVatProvider, VatDetailsDO} from '../core/services/vat/IVatProvider';
import {ITimeZonesService, TimeZoneDO} from '../core/services/time-zones/ITimeZonesService';

import {SessionContext} from '../core/utils/SessionContext';
import {RoomMetaRepoDO, RoomSearchResultRepoDO} from '../core/data-layer/rooms/repositories/IRoomRepository';

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
				status: {
					displayName:"Occupied"
				},
				roomCategory: {
					displayName: "Single"
				},
				properties: {
					name: "501",
					booking: {
						clientName: "Allan Paulsen",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Occupied"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "502",
					maintenanceStatus: "Dirty",
					booking: {
						clientName: "Robert Paulsen",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Single"
				},
				properties: {
					name: "503",
					maintenanceStatus: "Dirty",
					booking: {
						clientName: "Robert Paulsen Catalin Andrei",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "504",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "Paul Paulsen",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "505",
					booking: {
						clientName: "Paul Paulsen",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"OutOfService"
				},
				roomCategory: {
					displayName: "Single"
				},
				properties: {
					name: "505",
					booking: {
						clientName: "Paul Paulsen",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Reserved"
				},
				roomCategory: {
					displayName: "Single"
				},
				properties: {
					name: "505",
					maintenanceStatus: "Dirty",
					booking: {
						clientName: "Paul Paulsen",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			}			
		];
		var roomsDay1 = [
			{
				status: {
					displayName:"Occupied"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "501",
					booking: {
						clientName: "Aaaaaaaaaaaa",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Occupied"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "502",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "BBbbbbbbbbbb",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "503",
					maintenanceStatus: "Dirty",
					booking: {
						clientName: "Ccccccccccc",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "504",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "Ddddddddddd",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "505",
					booking: {
						clientName: "Eeeeeeeeeeee",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"OutOfService"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "505",
					booking: {
						clientName: "Fffffffffffff",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Reserved"
				},
				roomCategory: {
					displayName: "Single"
				},
				properties: {
					name: "505",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "Gggggggggggggggg",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			}			
		];

		var roomsDay2 = [
			{
				status: {
					displayName:"Occupied"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "501",
					booking: {
						clientName: "Hhhhhhhhhhhhhhhhhh",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Occupied"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "502",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "Iiiiiiiiiiiiiiiiiiii",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "503",
					maintenanceStatus: "Dirty",
					booking: {
						clientName: "Jjjjjjjjjjjjjjjjjjjjj",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "504",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "Kkkkkkkkkkkkkkkkkkk",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "505",
					booking: {
						clientName: "Lllllllllllllllllllll",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"OutOfService"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "505",
					booking: {
						clientName: "MMmmmmmmmmmmmmmm",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Reserved"
				},
				roomCategory: {
					displayName: "Single"
				},
				properties: {
					name: "505",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "Nnnnnnnnnnnnnnnnnn",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 14.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			}			
		];

		this._roomsList = [roomsDay0, roomsDay1, roomsDay2];
		this._rooms = [
			{
				status: {
					displayName:"Occupied"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "501",
					booking: {
						clientName: "Tudor Nechifor",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Occupied"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "502",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "Adrian Potcovaru",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "503",
					maintenanceStatus: "Dirty",
					booking: {
						clientName: "Iiiiiiiiiiiiiiii",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "504",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "Jjjjjjjjjjjjjj",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Free"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "505",
					booking: {
						clientName: "Kkkkkkkkkkkkkkk",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"OutOfService"
				},
				roomCategory: {
					displayName: "Double"
				},
				properties: {
					name: "505",
					booking: {
						clientName: "Lllllllllllll",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			},
			{
				status: {
					displayName:"Reserved"
				},
				roomCategory: {
					displayName: "Single"
				},
				properties: {
					name: "505",
					maintenanceStatus: "PickUp",
					booking: {
						clientName: "MMMMMMMmmmmmmmm",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			}			
		];

		var arrivalsDay0 = [
			{
				clientName: "Robert Paulsen",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 7,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 20.02.16",
				departureDate: ""
			},
			{
				clientName: "John Snow",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 5,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 18.02.16",
				departureDate: ""
			},
			{
				clientName: "Erika Einstein",
				roomType: "Single",
				numberOfPeople: 2,
				numberOfNights: 6,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 19.02.16",
				departureDate: ""
			},
			{
				clientName: "Dragos Pricope",
				roomType: "Double",
				numberOfPeople: 1,
				numberOfNights: 3,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 16.02.16",
				departureDate: ""
			}
		];

		var arrivalsDay1 = [
			{
				clientName: "Aaaaa",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 7,
				arrivalLabel: "Wed 14.02.16",
				arrivalDate: "",
				departureLabel: "Sat 20.02.16",
				departureDate: ""
			},
			{
				clientName: "Bbbbb",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 5,
				arrivalLabel: "Wed 14.02.16",
				arrivalDate: "",
				departureLabel: "Sat 18.02.16",
				departureDate: ""
			}
		];

		var arrivalsDay2 = [
			{
				clientName: "Cccccc",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 7,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 20.02.16",
				departureDate: ""
			},
			{
				clientName: "DDDddddd",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 5,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 18.02.16",
				departureDate: ""
			},
			{
				clientName: "EEEeeeeee",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 5,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 18.02.16",
				departureDate: ""
			}			
		];

		this._arrivalsList = [arrivalsDay0, arrivalsDay1, arrivalsDay2];

		var departureDay0 = [
			{
				clientName: "Robert Paulsen",
				roomName: "502",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 7,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 20.02.16",
				departureDate: ""
			},
			{
				clientName: "John Snow",
				roomName: "502",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 5,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 18.02.16",
				departureDate: ""
			},		
			{
				clientName: "Erika Einstein",
				roomName: "502",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 6,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 19.02.16",
				departureDate: ""
			},
			{
				clientName: "Dragos Pricope",
				roomName: "502",
				roomType: "Double",
				numberOfPeople: 1,
				numberOfNights: 3,
				arrivalLabel: "Wed 13.02.16",
				arrivalDate: "",
				departureLabel: "Sat 16.02.16",
				departureDate: ""
			}
		];
		var departureDay1 = [
			{
				clientName: "HHHHH",
				roomName: "502",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 7,
				arrivalLabel: "Wed 14.02.16",
				arrivalDate: "",
				departureLabel: "Sat 20.02.16",
				departureDate: ""
			}
		];
		var departureDay2 = [
			{
				clientName: "Uuuuuuuuuuuuuu",
				roomName: "502",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 7,
				arrivalLabel: "Wed 15.02.16",
				arrivalDate: "",
				departureLabel: "Sat 20.02.16",
				departureDate: ""
			},
			{
				clientName: "Tttttttttttt",
				roomName: "502",
				roomType: "Double",
				numberOfPeople: 2,
				numberOfNights: 5,
				arrivalLabel: "Wed 15.02.16",
				arrivalDate: "",
				departureLabel: "Sat 18.02.16",
				departureDate: ""
			}
		];

		this._departuresList = [departureDay0, departureDay1, departureDay2];
	}

	private buildRoomVM(room){
		return {
				status: {
					displayName:"Occupied"
				},
				roomCategory: {
					displayName: "Single"
				},
				properties: {
					name: "501",
					booking: {
						clientName: "Allan Paulsen",
						numberOfPeople: 2,
						numberOfNights: 7,
						arrivalLabel: "Wed 13.02.16",
						arrivalDate: "",
						departureLabel: "Sat 17.02.16",
						departureDate: ""
					}
				}
			};
	}
	
    public getRooms(req: Express.Request, res: Express.Response){
		if (!this.precheckGETParameters(req, res, ['state', 'date'])) { return };

		// var roomVMList = [];
        // var appContext: AppContext = req.appContext;
        // var sessionContext: SessionContext = req.sessionContext;

        // var roomMeta = this.getRoomMetaRepoDOFrom(sessionContext);

		// var roomRepo = appContext.getRepositoryFactory().getRoomRepository();
		// roomRepo.getRoomList(roomMeta, {},  { pageNumber: 0, pageSize: 100}).then((rooms: RoomSearchResultRepoDO) => {
		// 	var category = roomRepo.getRoomCategoryIdList(roomMeta);
		// 	rooms.roomList.forEach((room) =>{
		// 		var vm = this.buildRoomVM(room);
		// 		roomVMList.push(vm);
		// 	});

		// 	this.returnSuccesfulResponse(req, res, roomVMList);
		// }).catch((err: any) => {
		// 	this.returnErrorResponse(req, res, err, ThStatusCode.RoomsControllerErrorGettingRooms);
		// });

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

    private getRoomMetaRepoDOFrom(sessionContext: SessionContext): RoomMetaRepoDO {
		return { hotelId: sessionContext.sessionDO.hotel.id };
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
        this.returnSuccesfulResponse(req, res, this._departuresList[date]);

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


