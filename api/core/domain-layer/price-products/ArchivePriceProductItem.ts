import { ThLogger, ThLogLevel } from '../../utils/logging/ThLogger';
import { ThError } from '../../utils/th-responses/ThError';
import { ThStatusCode } from '../../utils/th-responses/ThResponse';
import { AppContext } from '../../utils/AppContext';
import { SessionContext } from '../../utils/SessionContext';
import { PriceProductMetaRepoDO, PriceProductItemMetaRepoDO } from '../../data-layer/price-products/repositories/IPriceProductRepository';
import { CustomerSearchResultRepoDO } from '../../data-layer/customers/repositories/ICustomerRepository';
import { PriceProductInputIdDO } from './validation-structures/PriceProductInputIdDO';
import { PriceProductDO, PriceProductStatus } from '../../data-layer/price-products/data-objects/PriceProductDO';
import { ValidationResultParser } from '../common/ValidationResultParser';
import { LazyLoadMetaResponseRepoDO } from '../../data-layer/common/repo-data-objects/LazyLoadRepoDO';
import { BookingDOConstraints } from '../../data-layer/bookings/data-objects/BookingDOConstraints';

export class ArchivePriceProductItem {
	private _inputDO: PriceProductInputIdDO;

	private _ppRepoMeta: PriceProductMetaRepoDO;
	private _ppItemRepoMeta: PriceProductItemMetaRepoDO;
	private _loadedPriceProduct: PriceProductDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._ppRepoMeta = { hotelId: this._sessionContext.sessionDO.hotel.id };
	}

	public archive(inputDO: PriceProductInputIdDO): Promise<PriceProductDO> {
		this._inputDO = inputDO;
		return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.archiveCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.ArchivePriceProductItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error archiving price product", this._inputDO, thError);
				reject(thError);
			}
		});
	}
	private archiveCore(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		var validationResult = PriceProductInputIdDO.getValidationStructure().validateStructure(this._inputDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._inputDO);
			parser.logAndReject("Error validating data for archive price product", reject);
			return false;
		}

		var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		ppRepo.getPriceProductById(this._ppRepoMeta, this._inputDO.id)
			.then((loadedPriceProduct: PriceProductDO) => {
				if (loadedPriceProduct.status !== PriceProductStatus.Active) {
					var thError = new ThError(ThStatusCode.ArchivePriceProductItemNonActiveStatus, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "cannot archive non active price product", this._inputDO, thError);
					throw thError;
				}
				this._loadedPriceProduct = loadedPriceProduct;
				this._ppItemRepoMeta = {
					id: loadedPriceProduct.id,
					versionId: loadedPriceProduct.versionId
				}

				var custRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
				return custRepo.getCustomerList(this._ppRepoMeta, { priceProductIdList: [this._inputDO.id] });
			})
			.then((customerSearchResult: CustomerSearchResultRepoDO) => {
				if (customerSearchResult.customerList.length > 0) {
					var thError = new ThError(ThStatusCode.ArchivePriceProductItemUsedInCustomersError, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "price product used by customers", this._inputDO, thError);
					throw thError;
				}
				var bookingsRepo = this._appContext.getRepositoryFactory().getBookingRepository();
				return bookingsRepo.getBookingListCount({ hotelId: this._sessionContext.sessionDO.hotel.id },
					{
						confirmationStatusList: BookingDOConstraints.ConfirmationStatuses_PriceProductForbidArchive,
						priceProductId: this._inputDO.id
					});
			}).then((bookingMetaRsp: LazyLoadMetaResponseRepoDO) => {
				if (bookingMetaRsp.numOfItems > 0) {
					var thError = new ThError(ThStatusCode.ArchivePriceProductItemUsedInBookingsError, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "price product used in bookings", this._inputDO, thError);
					throw thError;
				}
				var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
				return ppRepo.updatePriceProductStatus(this._ppRepoMeta, this._ppItemRepoMeta, {
					oldStatus: PriceProductStatus.Active,
					newStatus: PriceProductStatus.Archived,
					priceProduct: this._loadedPriceProduct
				});
			})
			.then((updatedPriceProduct: PriceProductDO) => {
				resolve(updatedPriceProduct);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.ArchivePriceProductItemError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error archiving price product item", this._inputDO, thError);
				}
				reject(thError);
			});
	}
}