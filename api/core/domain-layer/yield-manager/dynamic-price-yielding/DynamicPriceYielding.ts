import { AppContext } from "../../../utils/AppContext";
import { SessionContext } from "../../../utils/SessionContext";
import { ThLogLevel, ThLogger } from "../../../utils/logging/ThLogger";
import { ThError } from "../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../utils/th-responses/ThResponse";
import { ThUtils } from "../../../utils/ThUtils";
import { DynamicPriceYieldingDO } from "./DynamicPriceYieldingDO";
import { PriceProductDO } from '../../../data-layer/price-products/data-objects/PriceProductDO';
import { ValidationResultParser } from "../../common/ValidationResultParser";
import { ThDateIntervalDO } from "../../../utils/th-dates/data-objects/ThDateIntervalDO";
import { DynamicPriceDO } from "../../../data-layer/price-products/data-objects/price/DynamicPriceDO";

export class DynamicPriceYielding {
    private _thUtils: ThUtils;

    private _yieldData: DynamicPriceYieldingDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public open(yieldData: DynamicPriceYieldingDO): Promise<PriceProductDO> {
        this._yieldData = yieldData;
        return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
            this.openCore(resolve, reject);
        });
    }

    private openCore(resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
        var validationResult = DynamicPriceYieldingDO.getValidationStructure().validateStructure(this._yieldData);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._yieldData);
            parser.logAndReject("Error validating data for yield dynamic prices", reject);
            return;
        }

        let yieldInterval = new ThDateIntervalDO();
        yieldInterval.buildFromObject(this._yieldData.interval);
        if (!yieldInterval.isValid() && !yieldInterval.start.isSame(yieldInterval.end)) {
            var thError = new ThError(ThStatusCode.DynamicPriceYieldingInvalidInterval, null);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid interval submitted to Dynamic Price Yield Management", this._yieldData, thError);
            reject(thError);
            return;
        }

        var ppRepo = this._appContext.getRepositoryFactory().getPriceProductRepository();
        ppRepo.getPriceProductById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._yieldData.priceProductId)
            .then((priceProduct: PriceProductDO) => {
                let dynamicPrice: DynamicPriceDO = priceProduct.price.getDynamicPriceById(this._yieldData.dynamicPriceId);
                if (this._thUtils.isUndefinedOrNull(dynamicPrice)) {
                    var thError = new ThError(ThStatusCode.DynamicPriceYieldingDynamicPriceNotFound, null);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Dynamic price was not found on the price product", this._yieldData, thError);
                    reject(thError);
                    return;
                }

                let dateList = yieldInterval.getThDateDOList();
                dateList.forEach(date => {
                    priceProduct.price.enableDynamicPriceForDate(dynamicPrice, date);
                });

                return ppRepo.updatePriceProduct({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    id: priceProduct.id,
                    versionId: priceProduct.versionId
                }, priceProduct);
            }).then((updatedPriceProduct: PriceProductDO) => {
                resolve(updatedPriceProduct);
            }).catch((error: any) => {
                reject(error);
            });
    }
}