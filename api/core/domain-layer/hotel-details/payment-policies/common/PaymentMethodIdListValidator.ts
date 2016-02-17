import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {PaymentMethodDO} from '../../../../data-layer/common/data-objects/payment-method/PaymentMethodDO';
import {ThUtils} from '../../../../utils/ThUtils';

import _ = require("underscore");
import async = require("async");

export class PaymentMethodIdListValidator {
	private _thUtils: ThUtils;
	private _availablePaymentMethods: PaymentMethodDO[];

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _paymentMethodIdList: string[]) {
		this._thUtils = new ThUtils();
	}
	public validateAsync(finishedValidatingListCallback: { (err: any, success?: string[]): void; }) {
		this.validate().then((result: string[]) => {
			finishedValidatingListCallback(null, result);
		}).catch((err: any) => {
			finishedValidatingListCallback(err);
		});
	}
	private validate(): Promise<string[]> {
		return new Promise<string[]>((resolve, reject) => {
			this.validateCore(resolve, reject);
        });
	}
	private validateCore(resolve: { (result: string[]): void }, reject: { (err: ThError): void }) {
		async.waterfall([
			((getPaymentMethodsCallback) => {
				var settingsRepository = this._appContext.getRepositoryFactory().getSettingsRepository();
				settingsRepository.getPaymentMethodsAsync(getPaymentMethodsCallback);
			}),
			((paymentMethods: PaymentMethodDO[], finishedValidationsCallback: { (err: ThError, success?: string[]): void; }) => {
				this._availablePaymentMethods = paymentMethods;

				if (this.paymentMethodListIsValid()) {
					finishedValidationsCallback(null, this._paymentMethodIdList);
				}
				else {
					var thError = new ThError(ThStatusCode.PaymentMethodIdListValidatorInvalid, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid payment method ids submitted", this._sessionContext, thError);
					finishedValidationsCallback(thError);
				}
			})
		], ((error: any, validatedPaymentIdList: string[]) => {
			if (error) {
				var thError = new ThError(ThStatusCode.PaymentMethodIdListValidatorError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "Error validating payment method id list", this._sessionContext, thError);
				}
				reject(thError);
			}
			else {
				resolve(validatedPaymentIdList);
			}
		}));
	}
	private paymentMethodListIsValid(): boolean {
		var isValid = true;
		this._paymentMethodIdList.forEach((paymentMethodId: string) => {
			isValid = this.paymentMethodIdIsValid(paymentMethodId) ? isValid : false;
		});
		return isValid;
	}
	private paymentMethodIdIsValid(paymentMethodId: string): boolean {
		var foundPaymentMethod: PaymentMethodDO = _.find(this._availablePaymentMethods, (paymentMethod: PaymentMethodDO) => {
			return paymentMethod.id == paymentMethodId;
		});
		return !this._thUtils.isUndefinedOrNull(foundPaymentMethod);
	}
}