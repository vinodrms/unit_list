import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {AppEnvironmentType} from '../core/utils/environment/UnitPalConfig';
import {AppContext} from '../core/utils/AppContext';
import {HotelGetDetails} from '../core/domain-layer/hotel-details/get-details/HotelGetDetails';
import {HotelDO} from '../core/data-layer/hotel/data-objects/HotelDO';
import {UserDO} from '../core/data-layer/hotel/data-objects/user/UserDO';
import {HotelUpdateBasicInfo} from '../core/domain-layer/hotel-details/basic-info/HotelUpdateBasicInfo';
import {HotelAddPaymentsPolicies} from '../core/domain-layer/hotel-details/payment-policies/HotelAddPaymentsPolicies';
import {HotelUpdatePaymentsMethods} from '../core/domain-layer/hotel-details/payment-policies/HotelUpdatePaymentsMethods';
import {HotelSaveTaxItem} from '../core/domain-layer/hotel-details/payment-policies/HotelSaveTaxItem';
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
	public addPaymentsAndPolicies(req: Express.Request, res: Express.Response) {
		var addPaymPolicies = new HotelAddPaymentsPolicies(req.appContext, req.sessionContext);
		addPaymPolicies.add(req.body.paymentsAndPolicies).then((details: { user: UserDO, hotel: HotelDO }) => {
			this.returnSuccesfulResponse(req, res, { details: details });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelDetailsControllerErrorAddingPaymentsAndPolicies);
		});
	}
	public updatePaymentsMethods(req: Express.Request, res: Express.Response) {
		var updatePaymMethods = new HotelUpdatePaymentsMethods(req.appContext, req.sessionContext, req.body.paymentMethods);
		updatePaymMethods.update().then((details: { user: UserDO, hotel: HotelDO }) => {
			this.returnSuccesfulResponse(req, res, { details: details });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelDetailsControllerErrorUpdatingPaymentMethods);
		});
	}
	public saveTaxItem(req: Express.Request, res: Express.Response) {
		var saveTaxItem = new HotelSaveTaxItem(req.appContext, req.sessionContext);
		saveTaxItem.save(req.body.taxItem).then((details: { user: UserDO, hotel: HotelDO }) => {
			this.returnSuccesfulResponse(req, res, { details: details });
		}).catch((err: any) => {
			this.returnErrorResponse(req, res, err, ThStatusCode.HotelDetailsControllerErrorSavingTaxItem);
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
	addPaymentsAndPolicies: hotelDetailsController.addPaymentsAndPolicies.bind(hotelDetailsController),
	updatePaymentsMethods: hotelDetailsController.updatePaymentsMethods.bind(hotelDetailsController),
	saveTaxItem: hotelDetailsController.saveTaxItem.bind(hotelDetailsController),
	updatePropertyDetails: hotelDetailsController.updatePropertyDetails.bind(hotelDetailsController),
}