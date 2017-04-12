import _ = require('underscore');

import { MongoPriceProductRepositoryDecorator } from "./MongoPriceProductRepositoryDecorator";
import { PriceProductMetaRepoDO, PriceProductSearchCriteriaRepoDO, PriceProductSearchResultRepoDO, PriceProductItemMetaRepoDO } from "../../IPriceProductRepository";
import { LazyLoadRepoDO } from "../../../../common/repo-data-objects/LazyLoadRepoDO";
import { PriceProductDO } from "../../../data-objects/PriceProductDO";
import { ThError } from "../../../../../utils/th-responses/ThError";
import { ThStatusCode } from "../../../../../utils/th-responses/ThResponse";
import { ThLogLevel, ThLogger } from "../../../../../utils/logging/ThLogger";
import { PriceProductPriceDO } from "../../../data-objects/price/PriceProductPriceDO";

export class MongoPriceProductRepositoryWithParentDecorator extends MongoPriceProductRepositoryDecorator {

    public getPriceProductList(meta: PriceProductMetaRepoDO, searchCriteria: PriceProductSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<PriceProductSearchResultRepoDO> {
        return new Promise<PriceProductSearchResultRepoDO>((resolve: { (result: PriceProductSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            var searchResult: PriceProductSearchResultRepoDO;
            super.getPriceProductList(meta, searchCriteria, lazyLoad)
                .then((baseSearchResult: PriceProductSearchResultRepoDO) => {
                    searchResult = baseSearchResult;
                    return this.attachPricesFromParent(searchResult.priceProductList, meta, { searchCriteria: searchCriteria, meta: meta });
                }).then((updatedPriceProductList: PriceProductDO[]) => {
                    searchResult.priceProductList = updatedPriceProductList;
                    resolve(searchResult);
                }).catch(e => {
                    reject(e);
                });
        });
    }

    public getPriceProductById(meta: PriceProductMetaRepoDO, priceProductId: string): Promise<PriceProductDO> {
        return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
            super.getPriceProductById(meta, priceProductId)
                .then((loadedPriceProduct: PriceProductDO) => {
                    return this.attachPricesFromParent([loadedPriceProduct], meta, { hotelId: meta.hotelId, priceProductId: priceProductId });
                }).then((updatedPriceProductList: PriceProductDO[]) => {
                    resolve(updatedPriceProductList[0]);
                }).catch(e => {
                    reject(e);
                });
        });
    }

    public addPriceProduct(meta: PriceProductMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO> {
        if (priceProduct.hasParent()) {
            priceProduct.price = new PriceProductPriceDO();
        }
        return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
            super.addPriceProduct(meta, priceProduct)
                .then((addedPriceProduct: PriceProductDO) => {
                    return this.attachPricesFromParent([addedPriceProduct], meta, { hotelId: meta.hotelId, priceProduct: priceProduct });
                }).then((updatedPriceProductList: PriceProductDO[]) => {
                    resolve(updatedPriceProductList[0]);
                }).catch(e => {
                    reject(e);
                });
        });
    }

    public updatePriceProduct(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO> {
        if (priceProduct.hasParent()) {
            priceProduct.price = new PriceProductPriceDO();
        }
        return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
            super.updatePriceProduct(meta, itemMeta, priceProduct)
                .then((updatedPriceProduct: PriceProductDO) => {
                    return this.attachPricesFromParent([updatedPriceProduct], meta, { hotelId: meta.hotelId, priceProduct: priceProduct });
                }).then((updatedPriceProductList: PriceProductDO[]) => {
                    resolve(updatedPriceProductList[0]);
                }).catch(e => {
                    reject(e);
                });
        });
    }

    private attachPricesFromParent(priceProductList: PriceProductDO[], meta: PriceProductMetaRepoDO, logContext: Object): Promise<PriceProductDO[]> {
        return new Promise<PriceProductDO[]>((resolve: { (result: PriceProductDO[]): void }, reject: { (err: ThError): void }) => {
            try {
                this.attachPricesFromParentCore(resolve, reject, priceProductList, meta, logContext);
            } catch (error) {
                var thError = new ThError(ThStatusCode.MongoPriceProductRepositoryWithParentDecoratorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error attaching parent price product's price", logContext, thError);
                reject(thError);
            }
        });
    }
    private attachPricesFromParentCore(resolve: { (result: PriceProductDO[]): void }, reject: { (err: ThError): void },
        priceProductList: PriceProductDO[], meta: PriceProductMetaRepoDO, logContext: Object) {
        let priceProductWithParentList: PriceProductDO[] = _.filter(priceProductList, priceProduct => {
            return priceProduct.hasParent();
        });
        var priceProductParentIdList: string[] = _.map(priceProductWithParentList, priceProduct => {
            return priceProduct.parentId;
        });
        priceProductParentIdList = _.uniq(priceProductParentIdList);
        if (priceProductParentIdList.length == 0) {
            resolve(priceProductList);
            return;
        }

        super.getPriceProductList(meta, {
            priceProductIdList: priceProductParentIdList
        }).then((searchResult: PriceProductSearchResultRepoDO) => {
            let parentPriceProductList: PriceProductDO[] = searchResult.priceProductList;
            let indexedParentPriceProductsById: { [id: string]: PriceProductDO; } = _.indexBy(parentPriceProductList, pp => { return pp.id });

            priceProductList.forEach((priceProduct: PriceProductDO) => {
                if (priceProduct.hasParent()) {
                    let parentPriceProduct: PriceProductDO = indexedParentPriceProductsById[priceProduct.parentId];
                    if (this._thUtils.isUndefinedOrNull(parentPriceProduct)) {
                        var thError = new ThError(ThStatusCode.MongoPriceProductRepositoryWithParentDecoratorErrorParentNotFound, null);
                        ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "parent price product not found", { context: logContext, parentId: priceProduct.parentId }, thError);
                        throw thError;
                    }
                    priceProduct.price = parentPriceProduct.price;
                }
            });

            resolve(priceProductList);
        }).catch(e => {
            reject(e);
        });
    }
}