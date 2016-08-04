import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateIntervalDO} from '../../../utils/th-dates/data-objects/ThDateIntervalDO';
import {ThDateIntervalUtils} from '../../../utils/th-dates/ThDateIntervalUtils';
import {IndexedBookingInterval} from '../../../data-layer/price-products/utils/IndexedBookingInterval';
import {PriceProductDO, PriceProductStatus} from '../../../data-layer/price-products/data-objects/PriceProductDO';
import {PriceProductSearchResultRepoDO} from '../../../data-layer/price-products/repositories/IPriceProductRepository';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {PriceProductReaderDO} from './PriceProductReaderDO';
import {PriceProductYieldResult, PriceProductYieldItem, YieldItemState, YieldItemStateType} from './utils/PriceProductYieldItem';

import _ = require('underscore');

export class PriceProductReader {
    private _priceProductReaderDO: PriceProductReaderDO;
    private _indexedInterval: IndexedBookingInterval;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getYieldItems(priceProductReaderDO: PriceProductReaderDO): Promise<PriceProductYieldResult> {
        this._priceProductReaderDO = priceProductReaderDO;
        return new Promise<PriceProductYieldResult>((resolve: { (result: PriceProductYieldResult): void }, reject: { (err: ThError): void }) => {
            this.getYieldItemsCore(resolve, reject);
        });
    }
    private getYieldItemsCore(resolve: { (result: PriceProductYieldResult): void }, reject: { (err: ThError): void }) {
        var validationResult = PriceProductReaderDO.getValidationStructure().validateStructure(this._priceProductReaderDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._priceProductReaderDO);
            parser.logAndReject("Error validating price product yield reader params", reject);
            return;
        }
        var thDateInterval = this.getPreprocessedThDateInterval();
        if (!thDateInterval.isValid()) {
            var thError = new ThError(ThStatusCode.PriceProductReaderInvalidInterval, null);
            ThLogger.getInstance().logError(ThLogLevel.Warning, "invalid interval for yield reader", this._priceProductReaderDO, thError);
            reject(thError);
            return;
        }
        this._indexedInterval = new IndexedBookingInterval(thDateInterval);

        var priceProductRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
        priceProductRepo.getPriceProductList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
            status: PriceProductStatus.Active
        }).then((searchResult: PriceProductSearchResultRepoDO) => {
            var priceProductList: PriceProductDO[] = searchResult.priceProductList;
            return this.getYieldItemList(priceProductList);
        }).then((yieldItemList: PriceProductYieldItem[]) => {
            var result = new PriceProductYieldResult();
            result.itemList = yieldItemList;
            result.dateList = this._indexedInterval.bookingDateList;
            resolve(result);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.PriceProductReaderError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error getting price products for yield", this._priceProductReaderDO, thError);
            }
            reject(thError);
        });
    }
    private getPreprocessedThDateInterval(): ThDateIntervalDO {
        var convertedInterval = new ThDateIntervalDO();
        convertedInterval.buildFromObject(this._priceProductReaderDO.interval);
        return convertedInterval;
    }

    private getYieldItemList(priceProductList: PriceProductDO[]): Promise<PriceProductYieldItem[]> {
        var promiseArray: Promise<PriceProductYieldItem>[] = []
        _.forEach(priceProductList, (priceProduct: PriceProductDO) => {
            promiseArray.push(this.getYieldItem(priceProduct));
        });
        return Promise.all(promiseArray);
    }
    private getYieldItem(priceProduct: PriceProductDO): Promise<PriceProductYieldItem> {
        return new Promise<PriceProductYieldItem>((resolve: { (result: PriceProductYieldItem): void }, reject: { (err: ThError): void }) => {
            this.getYieldItemCore(resolve, reject, priceProduct);
        });
    }
    private getYieldItemCore(resolve: { (result: PriceProductYieldItem): void }, reject: { (err: ThError): void }, priceProduct: PriceProductDO) {
        var yieldItem = new PriceProductYieldItem();
        yieldItem.priceProductId = priceProduct.id;
        yieldItem.priceProductName = priceProduct.name;
        yieldItem.yieldFilterList = priceProduct.yieldFilterList;
        yieldItem.stateList = [];

        var openIntervalUtils = new ThDateIntervalUtils(priceProduct.openIntervalList);
        var openForArrivalIntervalUtils = new ThDateIntervalUtils(priceProduct.openForArrivalIntervalList);
        var openForDepartureIntervalUtils = new ThDateIntervalUtils(priceProduct.openForDepartureIntervalList);

        _.forEach(this._indexedInterval.bookingDateList, (date: ThDateDO) => {
            var state = new YieldItemState();
            state.open = openIntervalUtils.containsThDateDO(date) ? YieldItemStateType.Open : YieldItemStateType.Closed;
            state.openForArrival = openForArrivalIntervalUtils.containsThDateDO(date) ? YieldItemStateType.Open : YieldItemStateType.Closed;
            state.openForDeparture = openForDepartureIntervalUtils.containsThDateDO(date) ? YieldItemStateType.Open : YieldItemStateType.Closed;
            yieldItem.stateList.push(state);
        });

        resolve(yieldItem);
    }
}