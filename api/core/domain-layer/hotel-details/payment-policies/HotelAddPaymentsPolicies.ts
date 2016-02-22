import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {HotelAddPaymentsPoliciesDO, HotelAddPaymentsPoliciesOtherTaxDO, HotelAddPaymentsPoliciesVatDO} from './HotelAddPaymentsPoliciesDO';
import {HotelDetailsBuilder, HotelDetailsDO} from '../utils/HotelDetailsBuilder';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {HotelTaxesDO} from '../../../data-layer/hotel/data-objects/taxes/HotelTaxesDO';
import {TaxDO, TaxType} from '../../../data-layer/common/data-objects/taxes/TaxDO';
import {PaymentMethodDO} from '../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {ThUtils} from '../../../utils/ThUtils';
import {HotelMetaRepoDO, PaymentsPoliciesRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';
import {CurrencyDO} from '../../../data-layer/common/data-objects/currency/CurrencyDO';
import {PaymentMethodIdListValidator} from './common/PaymentMethodIdListValidator';

import _ = require("underscore");
import async = require("async");

export class HotelAddPaymentsPolicies {
	private _paymentPoliciesDO: HotelAddPaymentsPoliciesDO;
	private _thUtils: ThUtils;
	private _loadedHotel: HotelDO;
	private _availableCurrencyList: CurrencyDO[];

	private _precheckedTaxes: HotelTaxesDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public add(paymentPoliciesDO: HotelAddPaymentsPoliciesDO): Promise<HotelDetailsDO> {
		this._paymentPoliciesDO = paymentPoliciesDO;
		return new Promise<HotelDetailsDO>((resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) => {
			this.addCore(resolve, reject);
		});
	}
	private addCore(resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) {
		var validationResult = HotelAddPaymentsPoliciesDO.getValidationStructure().validateStructure(this._paymentPoliciesDO);
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
				hotelRepository.addPaymentsPoliciesAsync(hotelMetaDO, paymentsPoliciesRepoDO, addPaymentsPoliciesCallback);
			}),
			((hotel: HotelDO, finishBuildResponse) => {
				var hotelDetailsBuilder = new HotelDetailsBuilder(this._sessionContext, hotel);
				hotelDetailsBuilder.buildAsync(finishBuildResponse);
			})
		], ((error: any, response: HotelDetailsDO) => {
			if (error) {
				var thError = new ThError(ThStatusCode.HotelAddPaymentsPoliciesError, error);
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
				var thError = new ThError(ThStatusCode.HotelAddPaymentsPoliciesErrorPrecheckingConstraints, e);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error prechecking constraints for payments and policies", this._paymentPoliciesDO, thError);
				reject(thError);
			}
        });
	}
	private precheckConstraintsCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		if (this._loadedHotel.configurationCompleted) {
			this.precheckLogAndReject(ThStatusCode.HotelAddPaymentPoliciesHotelAlreadyConfigured, "Hotel configured & can't add other payment policies", reject);
			return;
		}
		if (!this.taxListsAreValid()) {
			this.precheckLogAndReject(ThStatusCode.HotelAddPaymentPoliciesInvalidTaxes, "Invalid taxes", reject);
			return;
		}
		if (!this.currencyCodeIsValid()) {
			this.precheckLogAndReject(ThStatusCode.HotelAddPaymentPoliciesInvalidCurrencyCode, "Invalid currency code", reject);
			return;
		}
		//TODO: consider the usage of the taxes inside price products? (during the configuration phase)
		resolve(true);
	}
	private taxListsAreValid(): boolean {
		var taxes = new HotelTaxesDO();
		taxes.vatList = [];
		taxes.otherTaxList = [];
		var isValid = this.vatListIsValid(taxes) && this.otherTaxListIsValid(taxes);
		this._precheckedTaxes = taxes;
		return isValid;
	}
	private vatListIsValid(taxes: HotelTaxesDO): boolean {
		var isValid = true;
		this._paymentPoliciesDO.taxes.vatList.forEach((vatEntry: HotelAddPaymentsPoliciesVatDO) => {
			var vatDO = this.buildTaxWithType(TaxType.Percentage, vatEntry.name, vatEntry.value);
			isValid = vatDO.isValid() ? isValid : false;
			this.pushIfValid(vatDO, taxes.vatList);
		});
		return isValid;
	}
	private otherTaxListIsValid(taxes: HotelTaxesDO): boolean {
		var isValid = true;
		this._paymentPoliciesDO.taxes.otherTaxList.forEach((taxEntry: HotelAddPaymentsPoliciesOtherTaxDO) => {
			var taxDo = this.buildTaxWithType(taxEntry.type, taxEntry.name, taxEntry.value);
			isValid = taxDo.isValid() ? isValid : false;
			this.pushIfValid(taxDo, taxes.otherTaxList);
		});
		return isValid;
	}
	private pushIfValid(taxDO: TaxDO, list: TaxDO[]) {
		if (taxDO.isValid()) {
			list.push(taxDO);
		}
	}
	private buildTaxWithType(taxType: TaxType, name: string, value: number): TaxDO {
		var tax = new TaxDO();
		tax.id = this._thUtils.generateUniqueID();
		tax.type = taxType;
		tax.name = name;
		tax.value = value;
		return tax;
	}

	private currencyCodeIsValid(): boolean {
		var foundCurrency = _.find(this._availableCurrencyList, (currency: CurrencyDO) => {
			return currency.code == this._paymentPoliciesDO.ccyCode;
		});
		return !this._thUtils.isUndefinedOrNull(foundCurrency);
	}

	private precheckLogAndReject(statusCode: ThStatusCode, message: string, reject: { (err: ThError): void }) {
		var thError = new ThError(statusCode, null);
		ThLogger.getInstance().logBusiness(ThLogLevel.Warning, message, this._sessionContext, thError);
		reject(thError);
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
			taxes: this._precheckedTaxes,
			paymentMethodIdList: this._paymentPoliciesDO.paymentMethodIdList
		};
	}
}