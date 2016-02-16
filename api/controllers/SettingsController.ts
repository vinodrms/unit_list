import {BaseController} from './base/BaseController';
import {ThStatusCode} from '../core/utils/th-responses/ThResponse';
import {ThUtils} from '../core/utils/ThUtils';
import {AppContext} from '../core/utils/AppContext';
import {SessionContext, SessionManager} from '../core/utils/SessionContext';
import {ISettingsRepository, AmenitySearchCriteriaDO, CountrySearchCriteriaDO, CurrencySearchCriteriaDO, PaymentMethodSearchCriteriaDO} from '../core/data-layer/settings/repositories/ISettingsRepository';

export class SettingsController extends BaseController {

    public getAmenities(req: Express.Request, res: Express.Response) {
        var amenityID: string = req.query.id;
        var thUtils = new ThUtils();
        var criteria: AmenitySearchCriteriaDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(amenityID) && amenityID.trim() != '') {
            criteria.id = amenityID;
        }

        settingsRepository.getAmenities(criteria).then((result: any) => {
            this.returnSuccesfulResponse(req, res, result);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });

    }
    public getCountries(req: Express.Request, res: Express.Response) {
        var countryCode = req.query.code;
        var thUtils = new ThUtils();
        var criteria: CountrySearchCriteriaDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(countryCode) && countryCode.trim() != '') {
            criteria.code = countryCode;
        }

        settingsRepository.getCountries(criteria).then((result: any) => {
            this.returnSuccesfulResponse(req, res, result);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });

    }
    public getCurrencies(req: Express.Request, res: Express.Response) {
        var currencyCode = req.query.code;
        var thUtils = new ThUtils();
        var criteria: CurrencySearchCriteriaDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(currencyCode) && currencyCode.trim() != '') {
            criteria.code = currencyCode;
        }

        settingsRepository.getCurrencies(criteria).then((result: any) => {
            this.returnSuccesfulResponse(req, res, result);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });

    }
    public getPaymentMethods(req: Express.Request, res: Express.Response) {
        var paymentMethodId = req.query.id;
        var thUtils = new ThUtils();
        var criteria: PaymentMethodSearchCriteriaDO = {};
        var settingsRepository: ISettingsRepository = req.appContext.getRepositoryFactory().getSettingsRepository();

        if (!thUtils.isUndefinedOrNull(paymentMethodId) && paymentMethodId.trim() != '') {
            criteria.id = paymentMethodId;
        }

        settingsRepository.getPaymentMethods(criteria).then((result: any) => {
            this.returnSuccesfulResponse(req, res, result);
        }).catch((err: any) => {
            this.returnErrorResponse(req, res, err, ThStatusCode.SettingsMongoRepositoryReadError);
        });

    }
}

var settingsController = new SettingsController();
module.exports = {
    getAmenities: settingsController.getAmenities.bind(settingsController),
    getCountries: settingsController.getCountries.bind(settingsController),
    getCurrencies: settingsController.getCurrencies.bind(settingsController),
    getPaymentMethods: settingsController.getPaymentMethods.bind(settingsController)
}