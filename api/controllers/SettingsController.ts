import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {ThUtils} from '../core/utils/ThUtils';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext, SessionManager} from '../core/utils/SessionContext';
import {ISettingsRepository, AmenitySearchCriteriaRepoDO, CountrySearchCriteriaRepoDO,
CurrencySearchCriteriaRepoDO, PaymentMethodSearchCriteriaRepoDO, AddOnProductCategoryCriteriaRepoDO,
RoomAttributeSearchCriteriaRepoDO} from '../core/data-layer/settings/repositories/ISettingsRepository';

export class SettingsController extends BaseController {
    
    public getRoomAttributes(req: any, res: any) {
        var roomAttributeID: string = req.query.id;
        var thUtils = new ThUtils();
        var criteria: AmenitySearchCriteriaRepoDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(roomAttributeID) && roomAttributeID.trim() != '') {
            criteria.id = roomAttributeID;
        }

        settingsRepository.getRoomAttributes(criteria).then((roomAttributeList: any) => {
            this.returnSuccesfulResponse(req, res, { roomAttributeList: roomAttributeList });
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });

    }
    
    public getRoomAmenities(req: any, res: any) {
        var amenityID: string = req.query.id;
        var thUtils = new ThUtils();
        var criteria: AmenitySearchCriteriaRepoDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(amenityID) && amenityID.trim() != '') {
            criteria.id = amenityID;
        }

        settingsRepository.getRoomAmenities(criteria).then((roomAmenityList: any) => {
            this.returnSuccesfulResponse(req, res, {roomAmenityList: roomAmenityList});
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });

    }
    public getHotelAmenities(req: any, res: any) {
        var amenityID: string = req.query.id;
        var thUtils = new ThUtils();
        var criteria: AmenitySearchCriteriaRepoDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(amenityID) && amenityID.trim() != '') {
            criteria.id = amenityID;
        }

        settingsRepository.getHotelAmenities(criteria).then((hotelAmenityList: any) => {
            this.returnSuccesfulResponse(req, res, {hotelAmenityList: hotelAmenityList});
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });

    }
    public getCountries(req: any, res: any) {
        var countryCode = req.query.code;
        var thUtils = new ThUtils();
        var criteria: CountrySearchCriteriaRepoDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(countryCode) && countryCode.trim() != '') {
            criteria.code = countryCode;
        }

        settingsRepository.getCountries(criteria).then((countryList: any) => {
            this.returnSuccesfulResponse(req, res, {countryList: countryList});
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });

    }
    public getCurrencies(req: any, res: any) {
        var currencyCode = req.query.code;
        var thUtils = new ThUtils();
        var criteria: CurrencySearchCriteriaRepoDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(currencyCode) && currencyCode.trim() != '') {
            criteria.code = currencyCode;
        }

        settingsRepository.getCurrencies(criteria).then((currencyList: any) => {
            this.returnSuccesfulResponse(req, res, {currencyList: currencyList});
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });

    }
    public getPaymentMethods(req: any, res: any) {
        var paymentMethodId = req.query.id;
        var thUtils = new ThUtils();
        var criteria: PaymentMethodSearchCriteriaRepoDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(paymentMethodId) && paymentMethodId.trim() != '') {
            criteria.id = paymentMethodId;
        }

        settingsRepository.getPaymentMethods(criteria).then((paymentMethodList: any) => {
            this.returnSuccesfulResponse(req, res, {paymentMethodList: paymentMethodList});
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });
    }
	public getAddOnProductCategories(req: any, res: any) {
        var addOnProductId = req.query.id;
        var thUtils = new ThUtils();
        var criteria: AddOnProductCategoryCriteriaRepoDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(addOnProductId) && addOnProductId.trim() != '') {
            criteria.id = addOnProductId;
        }

        settingsRepository.getAddOnProductCategories(criteria).then((addOnProductCategoryList: any) => {
            this.returnSuccesfulResponse(req, res, {addOnProductCategoryList: addOnProductCategoryList});
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });
    }
    public getBedTemplates(req: any, res: any) {
        var thUtils = new ThUtils();
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();
        settingsRepository.getBedTemplates().then((bedTemplateList: any) => {
            this.returnSuccesfulResponse(req, res, {bedTemplateList: bedTemplateList});
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });
    }
}

var settingsController = new SettingsController();
module.exports = {
    getRoomAttributes: settingsController.getRoomAttributes.bind(settingsController),
    getRoomAmenities: settingsController.getRoomAmenities.bind(settingsController),
    getHotelAmenities: settingsController.getHotelAmenities.bind(settingsController),
    getCountries: settingsController.getCountries.bind(settingsController),
    getCurrencies: settingsController.getCurrencies.bind(settingsController),
    getPaymentMethods: settingsController.getPaymentMethods.bind(settingsController),
	getAddOnProductCategories: settingsController.getAddOnProductCategories.bind(settingsController),
    getBedTemplates: settingsController.getBedTemplates.bind(settingsController)
}