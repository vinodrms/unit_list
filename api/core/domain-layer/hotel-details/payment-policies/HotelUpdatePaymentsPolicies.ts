import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {HotelUpdatePaymentsPoliciesDO} from './HotelUpdatePaymentsPoliciesDO';
import {HotelDetailsBuilder, HotelDetailsDO} from '../utils/HotelDetailsBuilder';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {PaymentMethodDO} from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {ThUtils} from '../../../utils/ThUtils';
import {HotelMetaRepoDO, PaymentsPoliciesRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';
import {CurrencyDO} from '../../../data-layer/common/data-objects/currency/CurrencyDO';
import {PaymentMethodIdListValidator} from './common/PaymentMethodIdListValidator';

import _ = require("underscore");
import async = require("async");

export class HotelUpdatePaymentsPolicies {
	private _paymentPoliciesDO: HotelUpdatePaymentsPoliciesDO;
	private _thUtils: ThUtils;
	private _loadedHotel: HotelDO;
	private _availableCurrencyList: CurrencyDO[];

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public update(paymentPoliciesDO: HotelUpdatePaymentsPoliciesDO): Promise<HotelDetailsDO> {
		this._paymentPoliciesDO = paymentPoliciesDO;
		return new Promise<HotelDetailsDO>((resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) => {
			this.updateCore(resolve, reject);
		});
	}
	private updateCore(resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) {
		var validationResult = HotelUpdatePaymentsPoliciesDO.getValidationStructure().validateStructure(this._paymentPoliciesDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._paymentPoliciesDO);
			parser.logAndReject("Error validating data for add payment policies", reject);
			return;
		}
		async.waterfall([
			((finishGetHotelByIdCallback) => {
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.getHotelByIdAsync(this._sessionContext.sessionDO.hotel.id, finishGetHotelByIdCallback);
			}),
			((hotel: HotelDO, finishedValidatingPaymentMethodIdListCallback) => {
				this._loadedHotel = hotel;

				var paymentMethodValidator = new PaymentMethodIdListValidator(this._appContext, this._sessionContext, this._paymentPoliciesDO.paymentMethodIdList);
				paymentMethodValidator.validateAsync(finishedValidatingPaymentMethodIdListCallback);
			}),
			((validatedPaymentMethodIdList: string[], getCurrenciesCallback) => {
				var settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
				settingsRepository.getCurrenciesAsync(getCurrenciesCallback, { code: this._paymentPoliciesDO.ccyCode });
			}),
			((currencyList: CurrencyDO[], finishedPrecheckingConstraintsCallback) => {
				this._availableCurrencyList = currencyList;

				this.precheckConstraintsAsync(finishedPrecheckingConstraintsCallback);
			}),
			((precheckConstraintsResult: boolean, addPaymentsPoliciesCallback) => {
				var hotelMetaDO: HotelMetaRepoDO = this.getHotelMetaDO();
				var paymentsPoliciesRepoDO = this.getPaymentsPoliciesRepoDO();
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.updatePaymentsPoliciesAsync(hotelMetaDO, paymentsPoliciesRepoDO, addPaymentsPoliciesCallback);
			}),
			((hotel: HotelDO, finishBuildResponse) => {
				var hotelDetailsBuilder = new HotelDetailsBuilder(this._sessionContext, hotel);
				hotelDetailsBuilder.buildAsync(finishBuildResponse);
			})
		], ((error: any, response: HotelDetailsDO) => {
			if (error) {
				var thError = new ThError(ThStatusCode.HotelUpdatePaymentsPoliciesError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating hotel payment and policies", this._sessionContext, thError);
				}
				reject(thError);
			}
			else {
				resolve(response);
			}
		}));
	}
	private precheckConstraintsAsync(finishedPrecheckingConstraintsCallback: { (err: any, success?: boolean): void; }) {
		this.precheckConstraints().then((result: boolean) => {
			finishedPrecheckingConstraintsCallback(null, result);
		}).catch((err: any) => {
			finishedPrecheckingConstraintsCallback(err);
		});
	}
	private precheckConstraints(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			try {
				this.precheckConstraintsCore(resolve, reject);
			} catch (e) {
				var thError = new ThError(ThStatusCode.HotelUpdatePaymentsPoliciesErrorPrecheckingConstraints, e);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error prechecking constraints for payments and policies", this._paymentPoliciesDO, thError);
				reject(thError);
			}
        });
	}
	private precheckConstraintsCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		if (!this.currencyCodeIsValid()) {
			var thError = new ThError(ThStatusCode.HotelUpdatePaymentPoliciesInvalidCurrencyCode, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid currency code", this._sessionContext, thError);
			reject(thError);
			return;
		}
		resolve(true);
	}
	private currencyCodeIsValid(): boolean {
		var foundCurrency = _.find(this._availableCurrencyList, (currency: CurrencyDO) => {
			return currency.code == this._paymentPoliciesDO.ccyCode;
		});
		return !this._thUtils.isUndefinedOrNull(foundCurrency);
	}

	private getHotelMetaDO(): HotelMetaRepoDO {
		return {
			id: this._loadedHotel.id,
			versionId: this._loadedHotel.versionId
		};
	}
	private getPaymentsPoliciesRepoDO(): PaymentsPoliciesRepoDO {
		return {
			ccyCode: this._paymentPoliciesDO.ccyCode,
			paymentMethodIdList: this._paymentPoliciesDO.paymentMethodIdList
		};
	}
}