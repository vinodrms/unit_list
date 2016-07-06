import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {AllotmentDO} from '../../../data-layer/allotments/data-objects/AllotmentDO';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {PriceProductDO, PriceProductStatus} from '../../../data-layer/price-products/data-objects/PriceProductDO';

export class AllotmentValidator {
	private _allotment: AllotmentDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}

	public validateAllotment(allotment: AllotmentDO): Promise<boolean> {
		this._allotment = allotment;
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.validateAllotmentCore(resolve, reject);
		});
	}
	private validateAllotmentCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		var custRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
		custRepo.getCustomerById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._allotment.customerId)
			.then((loadedCustomer: CustomerDO) => {
				if (!_.contains(loadedCustomer.priceProductDetails.priceProductIdList, this._allotment.priceProductId)) {
					var thError = new ThError(ThStatusCode.AllotmentValidatorInvalidPriceProductId, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid price product id on allotment save", this._allotment, thError);
					throw thError;
				}
				var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
				return ppRepo.getPriceProductById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._allotment.priceProductId);
			}).then((loadedPriceProduct: PriceProductDO) => {
				if (loadedPriceProduct.status !== PriceProductStatus.Active) {
					var thError = new ThError(ThStatusCode.AllotmentValidatorNotActivePriceProduct, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Not active price product on allotment save", this._allotment, thError);
					throw thError;
				}
				if (!_.contains(loadedPriceProduct.roomCategoryIdList, this._allotment.roomCategoryId)) {
					var thError = new ThError(ThStatusCode.AllotmentValidatorInvalidRoomCategId, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid room category id on allotment save", this._allotment, thError);
					throw thError;
				}
				resolve(true);
			}).catch((error: any) => {
				reject(error);
			});
	}
}