import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppEnvironmentType} from '../core/utils/environment/UnitPalConfig';
import {AppContext} from '../core/utils/AppContext';
import {HotelGetDetails} from '../core/domain-layer/hotel-details/get-details/HotelGetDetails';
import {HotelDO} from '../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../core/data-layer/hotel/data-objects/user/UserDO';
import {HotelUpdateBasicInfo} from '../core/domain-layer/hotel-details/basic-info/HotelUpdateBasicInfo';
import {HotelUpdatePaymentsPolicies} from '../core/domain-layer/hotel-details/payment-policies/HotelUpdatePaymentsPolicies';
import {HotelUpdatePropertyDetails} from '../core/domain-layer/hotel-details/property-details/HotelUpdatePropertyDetails';

class HotelDetailsController extends BaseController {
	public getDetails(req: Express.Request, res: Express.Response) {
		var hotelDetails = new HotelGetDetails(req.appContext, req.sessionContext);
		hotelDetails.getDetails().then((details: { user: UserDO, hotel: HotelDO }) => {
			this.returnSuccesfulResponse(req, res, { details: details });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelDetailsControllerErrorGettingDetails);
		});
	}
	public updateBasicInfo(req: Express.Request, res: Express.Response) {
		var updateBasicInfo = new HotelUpdateBasicInfo(req.appContext, req.sessionContext, req.body.basicInfo);
		updateBasicInfo.update().then((details: { user: UserDO, hotel: HotelDO }) => {
			this.returnSuccesfulResponse(req, res, { details: details });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelDetailsControllerErrorUpdatingBasicInfo);
		});
	}
	public updatePaymentsAndPolicies(req: Express.Request, res: Express.Response) {
		var updatePaymPolicies = new HotelUpdatePaymentsPolicies(req.appContext, req.sessionContext);
		updatePaymPolicies.update(req.body.paymentsAndPolicies).then((details: { user: UserDO, hotel: HotelDO }) => {
			this.returnSuccesfulResponse(req, res, { details: details });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelDetailsControllerErrorAddingPaymentsAndPolicies);
		});
	}
	public updatePropertyDetails(req: Express.Request, res: Express.Response) {
		var updatePropDetails = new HotelUpdatePropertyDetails(req.appContext, req.sessionContext, req.body.propertyDetails);
		updatePropDetails.update().then((result: { user: UserDO, hotel: HotelDO }) => {
			this.returnSuccesfulResponse(req, res, { details: result });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelDetailsControllerErrorUpdatingPropertyDetails);
		});
	}
}

var hotelDetailsController = new HotelDetailsController();
module.exports = {
	getDetails: hotelDetailsController.getDetails.bind(hotelDetailsController),
	updateBasicInfo: hotelDetailsController.updateBasicInfo.bind(hotelDetailsController),
	updatePaymentsAndPolicies: hotelDetailsController.updatePaymentsAndPolicies.bind(hotelDetailsController),
	updatePropertyDetails: hotelDetailsController.updatePropertyDetails.bind(hotelDetailsController),
}