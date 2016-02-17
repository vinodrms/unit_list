import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {IValidationStructure} from '../../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../../utils/th-validation/structure/ObjectValidationStructure';
import {ArrayValidationStructure} from '../../../utils/th-validation/structure/ArrayValidationStructure';
import {PrimitiveValidationStructure} from '../../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../../utils/th-validation/rules/StringValidationRule';
import {HotelDetailsBuilder, HotelDetailsDO} from '../utils/HotelDetailsBuilder';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {PaymentMethodIdListValidator} from './common/PaymentMethodIdListValidator';
import {HotelMetaRepoDO, PaymentMethodIdListRepoDO} from '../../../data-layer/hotel/repositories/IHotelRepository';

export class HotelUpdatePaymentsMethodsDO {
	paymentMethodIdList: string[];
	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "paymentMethodIdList",
				validationStruct: new ArrayValidationStructure(
					new PrimitiveValidationStructure(new StringValidationRule())
				)
			}
		]);
	}
}

export class HotelUpdatePaymentsMethods {
	private _loadedHotel: HotelDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _paymentMethodsDO: HotelUpdatePaymentsMethodsDO) {
	}
	public update(): Promise<HotelDetailsDO> {
		return new Promise<HotelDetailsDO>((resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) => {
			this.updateCore(resolve, reject);
		});
	}
	private updateCore(resolve: { (result: HotelDetailsDO): void }, reject: { (err: ThError): void }) {
		var validationResult = HotelUpdatePaymentsMethodsDO.getValidationStructure().validateStructure(this._paymentMethodsDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._paymentMethodsDO);
			parser.logAndReject("Error validating data for update payment methods", reject);
			return;
		}
		async.waterfall([
			((finishGetHotelByIdCallback) => {
				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.getHotelByIdAsync(this._sessionContext.sessionDO.hotel.id, finishGetHotelByIdCallback);
			}),
			((hotel: HotelDO, finishedValidatingPaymentMethodIdListCallback) => {
				this._loadedHotel = hotel;

				var paymentMethodValidator = new PaymentMethodIdListValidator(this._appContext, this._sessionContext, this._paymentMethodsDO.paymentMethodIdList);
				paymentMethodValidator.validateAsync(finishedValidatingPaymentMethodIdListCallback);
			}),
			((validatedPaymentMethodIdList: string[], updatePaymentMethodIdListCallback) => {
				var hotelMetaDO: HotelMetaRepoDO = this.getHotelMetaDO();
				var paymentMethodIdListRepoDO = this.getPaymentMethodIdListRepoDO();

				var hotelRepository = this._appContext.getRepositoryFactory().getHotelRepository();
				hotelRepository.updatePaymentMethodIdListAsync(hotelMetaDO, paymentMethodIdListRepoDO, updatePaymentMethodIdListCallback);
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
	private getHotelMetaDO(): HotelMetaRepoDO {
		return {
			id: this._loadedHotel.id,
			versionId: this._loadedHotel.versionId
		};
	}
	private getPaymentMethodIdListRepoDO(): PaymentMethodIdListRepoDO {
		return {
			paymentMethodIdList: this._paymentMethodsDO.paymentMethodIdList
		}
	}
}