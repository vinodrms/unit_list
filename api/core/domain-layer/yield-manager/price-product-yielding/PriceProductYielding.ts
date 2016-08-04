import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {PriceProductYieldingDO, PriceProductYieldAttribute} from './PriceProductYieldingDO';
import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {PriceProductMetaRepoDO, PriceProductItemMetaRepoDO} from '../../../data-layer/price-products/repositories/IPriceProductRepository';
import {IPriceProductIntervalStrategy} from './interval-strategies/IPriceProductIntervalStrategy';
import {PriceProductAddIntervalStrategy} from './interval-strategies/PriceProductAddIntervalStrategy';
import {PriceProductRemoveIntervalStrategy} from './interval-strategies/PriceProductRemoveIntervalStrategy';
import {IndexedBookingInterval} from '../../../data-layer/price-products/utils/IndexedBookingInterval';

export class PriceProductYielding {
	private _yieldData: PriceProductYieldingDO;
	private _yieldInterval: ThDateIntervalDO;
	private _intervalStrategy: IPriceProductIntervalStrategy;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}

	public open(yieldData: PriceProductYieldingDO): Promise<PriceProductDO[]> {
		return this.yield(yieldData, new PriceProductAddIntervalStrategy());
	}

	public close(yieldData: PriceProductYieldingDO): Promise<PriceProductDO[]> {
		return this.yield(yieldData, new PriceProductRemoveIntervalStrategy());
	}

	private yield(yieldData: PriceProductYieldingDO, intervalStrategy: IPriceProductIntervalStrategy): Promise<PriceProductDO[]> {
		this._yieldData = yieldData;
		this._intervalStrategy = intervalStrategy;
		return new Promise<PriceProductDO[]>((resolve: { (result: PriceProductDO[]): void }, reject: { (err: ThError): void }) => {
			this.yieldCore(resolve, reject);
		});
	}
	private yieldCore(resolve: { (result: PriceProductDO[]): void }, reject: { (err: ThError): void }) {
		var validationResult = PriceProductYieldingDO.getValidationStructure().validateStructure(this._yieldData);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._yieldData);
			parser.logAndReject("Error validating data for yield price products", reject);
			return false;
		}
		var yieldInterval = new ThDateIntervalDO();
		yieldInterval.buildFromObject(this._yieldData.interval);
		if (!yieldInterval.isValid()) {
			var thError = new ThError(ThStatusCode.PriceProductsYieldManagementInvalidInterval, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid interval submitted to Price Products Yield Management", this._yieldData, thError);
			reject(thError);
			return;
		}
		var indexedInterval = new IndexedBookingInterval(yieldInterval);
		this._yieldInterval = indexedInterval.indexedBookingInterval;

		var ppPromiseList: Promise<PriceProductDO>[] = [];
		this._yieldData.priceProductIdList.forEach((priceProductId: string) => {
			ppPromiseList.push(this.yieldPriceProduct(priceProductId));
		});
		Promise.all(ppPromiseList).then((priceProductList: PriceProductDO[]) => {
			resolve(priceProductList);
		}).catch((error: any) => {
			reject(error);
		});
	}

	private yieldPriceProduct(priceProductId: string): Promise<PriceProductDO> {
		return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
			this.yieldPriceProductCore(resolve, reject, priceProductId);
		});
	}
	private yieldPriceProductCore(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }, priceProductId: string) {
		var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		ppRepo.getPriceProductById(this.buildPriceProductMetaRepoDO(), priceProductId)
			.then((loadedPriceProduct: PriceProductDO) => {
				var updatedPriceProduct = this.updateIntervalsOn(loadedPriceProduct);
				return ppRepo.updatePriceProductYieldManagerIntervals(this.buildPriceProductMetaRepoDO(), this.buildPriceProductItemMetaRepoDO(loadedPriceProduct),
					{
						openIntervalList: updatedPriceProduct.openIntervalList,
						openForArrivalIntervalList: updatedPriceProduct.openForArrivalIntervalList,
						openForDepartureIntervalList: updatedPriceProduct.openForDepartureIntervalList
					})
			})
			.then((updatedPriceProduct: PriceProductDO) => {
				resolve(updatedPriceProduct);
			})
			.catch((error: any) => {
				reject(error);
			});
	}
	private updateIntervalsOn(priceProduct: PriceProductDO): PriceProductDO {
		switch (this._yieldData.attribute) {
			case PriceProductYieldAttribute.OpenPeriod:
				priceProduct.openIntervalList = this._intervalStrategy.apply(priceProduct.openIntervalList, this._yieldInterval);
				break;
			case PriceProductYieldAttribute.OpenForArrivalPeriod:
				priceProduct.openForArrivalIntervalList = this._intervalStrategy.apply(priceProduct.openForArrivalIntervalList, this._yieldInterval);
				break;
			case PriceProductYieldAttribute.OpenForDeparturePeriod:
				priceProduct.openForDepartureIntervalList = this._intervalStrategy.apply(priceProduct.openForDepartureIntervalList, this._yieldInterval);
				break;
			default:
				break;
		}
		return priceProduct;
	}
	private buildPriceProductMetaRepoDO(): PriceProductMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
	private buildPriceProductItemMetaRepoDO(priceProduct: PriceProductDO): PriceProductItemMetaRepoDO {
		return {
			id: priceProduct.id,
			versionId: priceProduct.versionId
		}
	}
}