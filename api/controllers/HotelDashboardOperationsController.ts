import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext} from '../core/utils/SessionContext';
import {HotelOperationsArrivalsReader} from '../core/domain-layer/hotel-operations/dashboard/arrivals/HotelOperationsArrivalsReader';
import {HotelOperationsArrivalsInfo} from '../core/domain-layer/hotel-operations/dashboard/arrivals/utils/HotelOperationsArrivalsInfo';
import {HotelOperationsDeparturesReader} from '../core/domain-layer/hotel-operations/dashboard/departures/HotelOperationsDeparturesReader';
import {HotelOperationsDeparturesInfo} from '../core/domain-layer/hotel-operations/dashboard/departures/utils/HotelOperationsDeparturesInfo';
import {HotelOperationsRoomInfoReader} from '../core/domain-layer/hotel-operations/dashboard/room-info/HotelOperationsRoomInfoReader';
import {HotelOperationsRoomInfo} from '../core/domain-layer/hotel-operations/dashboard/room-info/utils/HotelOperationsRoomInfo';

class HotelDashboardOperationsController extends BaseController {

	public getArrivals(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

		var arrivalsReader = new HotelOperationsArrivalsReader(appContext, sessionContext);
		arrivalsReader.read(req.body.query).then((arrivalsInfo: HotelOperationsArrivalsInfo) => {
			this.returnSuccesfulResponse(req, res, arrivalsInfo);
		}).catch((error: any) => {
			this.returnErrorResponse(req, res, error, ThStatusCode.HotelOperationsDashboardControllerErrorGettingArrivals);
		});
    }

	public getDepartures(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

		var departuresReader = new HotelOperationsDeparturesReader(appContext, sessionContext);
		departuresReader.read(req.body.query).then((departuresInfo: HotelOperationsDeparturesInfo) => {
			this.returnSuccesfulResponse(req, res, departuresInfo);
		}).catch((error: any) => {
			this.returnErrorResponse(req, res, error, ThStatusCode.HotelOperationsDashboardControllerErrorGettingDepartures);
		});
    }

	public getRooms(req: any, res: any) {
        var appContext: AppContext = req.appContext;
        var sessionContext: SessionContext = req.sessionContext;

		var roomReader = new HotelOperationsRoomInfoReader(appContext, sessionContext);
		roomReader.read().then((roomsInfo: HotelOperationsRoomInfo) => {
			this.returnSuccesfulResponse(req, res, roomsInfo);
		}).catch((error: any) => {
			this.returnErrorResponse(req, res, error, ThStatusCode.HotelOperationsDashboardControllerErrorGettingRooms);
		});
    }
}

var hotelDashboardOperationsController = new HotelDashboardOperationsController();
module.exports = {
	getArrivals: hotelDashboardOperationsController.getArrivals.bind(hotelDashboardOperationsController),
	getDepartures: hotelDashboardOperationsController.getDepartures.bind(hotelDashboardOperationsController),
	getRooms: hotelDashboardOperationsController.getRooms.bind(hotelDashboardOperationsController)
}