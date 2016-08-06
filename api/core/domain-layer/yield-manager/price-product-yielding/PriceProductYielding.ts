import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {PriceProductYieldingDO} from './PriceProductYieldingDO';
import {PriceProductDO} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateUtils} from '../../../utils/th-dates/ThDateUtils';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {PriceProductMetaRepoDO, PriceProductItemMetaRepoDO, PriceProductSearchResultRepoDO} from '../../../data-layer/price-products/repositories/IPriceProductRepository';
import {PriceProductYieldStrategyFactory} from './utils/PriceProductYieldStrategyFactory';
import {IPriceProductYieldStrategy} from './utils/IPriceProductYieldStrategy';

import _ = require('underscore');

export class PriceProductYielding {
	private _thDateUtils: ThDateUtils;

	private _yieldData: PriceProductYieldingDO;
	private _yieldInterval: ThDateIntervalDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thDateUtils = new ThDateUtils();
	}

	public yield(yieldData: PriceProductYieldingDO): Promise<PriceProductDO[]> {
		this._yieldData = yieldData;
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
		if (!this.buildYieldInterval(reject)) { return; }
		if (this._yieldData.priceProductIdList.length == 0) {
			resolve([]);
			return;
		}

		var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		ppRepo.getPriceProductList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
			priceProductIdList: this._yieldData.priceProductIdList
		}).then((searchResult: PriceProductSearchResultRepoDO) => {
			var priceProductList: PriceProductDO[] = searchResult.priceProductList;
			var ppPromiseList: Promise<PriceProductDO>[] = [];
			priceProductList.forEach((priceProduct: PriceProductDO) => {
				ppPromiseList.push(this.yieldPriceProduct(priceProduct));
			});
			return Promise.all(ppPromiseList);
		}).then((yieldedPriceProductList: PriceProductDO[]) => {
			resolve(yieldedPriceProductList);
		}).catch((error: any) => {
			reject(error);
		});
	}

	private yieldPriceProduct(priceProduct: PriceProductDO): Promise<PriceProductDO> {
		return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
			this.yieldPriceProductCore(resolve, reject, priceProduct);
		});
	}
	private yieldPriceProductCore(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }, priceProduct: PriceProductDO) {
		var yieldFactory = new PriceProductYieldStrategyFactory();
		var yieldStrategy = yieldFactory.getYieldStrategy(this._yieldData);
		var yieldedPriceProduct = yieldStrategy.yield(priceProduct, this._yieldInterval);

		var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
		ppRepo.updatePriceProductYieldManagerIntervals({ hotelId: this._sessionContext.sessionDO.hotel.id },
			{
				id: yieldedPriceProduct.id,
				versionId: yieldedPriceProduct.versionId
			}, {
				openIntervalList: yieldedPriceProduct.openIntervalList,
				openForArrivalIntervalList: yieldedPriceProduct.openForArrivalIntervalList,
				openForDepartureIntervalList: yieldedPriceProduct.openForDepartureIntervalList
			})
			.then((updatedPriceProduct: PriceProductDO) => {
				resolve(updatedPriceProduct);
			})
			.catch((error: any) => {
				reject(error);
			});
	}

	private buildYieldInterval(reject: { (err: ThError): void }): boolean {
		if (this._yieldData.forever) {
			return this.buildForeverYieldInterval();
		}
		return this.buildCustomYieldInterval(reject);
	}
	private buildForeverYieldInterval(): boolean {
		var minDate = this._thDateUtils.getMinThDateDO();
		var maxDate = this._thDateUtils.getMaxThDateDO();
		this._yieldInterval = ThDateIntervalDO.buildThDateIntervalDO(minDate, maxDate);
		return true;
	}
	private buildCustomYieldInterval(reject: { (err: ThError): void }): boolean {
		var validationResult = PriceProductYieldingDO.getIntervalValidationStructure().validateStructure(this._yieldData.interval);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._yieldData);
			parser.logAndReject("Error validating submitted interval", reject);
			return false;
		}
		this._yieldInterval = new ThDateIntervalDO();
		this._yieldInterval.buildFromObject(this._yieldData.interval);
		if (!this._yieldInterval.isValid() && !this._yieldInterval.start.isSame(this._yieldInterval.end)) {
			var thError = new ThError(ThStatusCode.PriceProductsYieldManagementInvalidInterval, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid interval submitted to Price Products Yield Management", this._yieldData, thError);
			reject(thError);
			return false;
		}
		return true;
	}
}