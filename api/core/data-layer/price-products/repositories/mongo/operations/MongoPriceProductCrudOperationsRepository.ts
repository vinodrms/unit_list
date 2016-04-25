import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository} from '../../../../common/base/MongoRepository';
import {PriceProductMetaRepoDO, PriceProductItemMetaRepoDO, PriceProductUpdateStatusParamsRepoDO, PriceProductUpdateYMIntervalsParamsRepoDO} from '../../IPriceProductRepository';
import {PriceProductDO, PriceProductStatus} from '../../../data-objects/PriceProductDO';
import {PriceProductYieldFilterMetaDO} from '../../../data-objects/yield-filter/PriceProductYieldFilterDO';
import {PriceProductRepositoryHelper} from './helpers/PriceProductRepositoryHelper';

export class MongoPriceProductCrudOperationsRepository extends MongoRepository {
	private _helper: PriceProductRepositoryHelper;

    constructor(priceProdEntity: Sails.Model) {
        super(priceProdEntity);
		this._helper = new PriceProductRepositoryHelper();
    }

	public addPriceProduct(meta: PriceProductMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO> {
		return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
			this.addPriceProductCore(meta, priceProduct, resolve, reject);
		});
	}
	private addPriceProductCore(meta: PriceProductMetaRepoDO, priceProduct: PriceProductDO, resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		priceProduct.hotelId = meta.hotelId;
		priceProduct.versionId = 0;

		this.createDocument(priceProduct,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.PriceProductRepositoryErrorAddingPriceProduct, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding price product", { meat: meta, priceProduct: priceProduct }, thError);
				reject(thError);
			},
			(createdPriceProduct: Object) => {
				resolve(this._helper.buildPriceProductDOFrom(createdPriceProduct));
			}
		);
	}

	public getPriceProductById(meta: PriceProductMetaRepoDO, priceProductId: string): Promise<PriceProductDO> {
		return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
			this.getPriceProductByIdCore(meta, priceProductId, resolve, reject);
		});
	}
	private getPriceProductByIdCore(meta: PriceProductMetaRepoDO, priceProductId: string, resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		this.findOneDocument({ "hotelId": meta.hotelId, "id": priceProductId },
			() => {
				var thError = new ThError(ThStatusCode.PriceProductRepositoryProductNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Price product not found", { meta: meta, priceProductId: priceProductId }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.PriceProductRepositoryErrorGettingPriceProduct, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting price product by id", { meta: meta, priceProductId: priceProductId }, thError);
				reject(thError);
			},
			(foundPriceProduct: Object) => {
				resolve(this._helper.buildPriceProductDOFrom(foundPriceProduct));
			}
		);
	}

	public updatePriceProduct(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, priceProduct: PriceProductDO): Promise<PriceProductDO> {
		return this.findAndModifyPriceProduct(meta, itemMeta, {},
			{
				"status": priceProduct.status,
				"name": priceProduct.name,
				"availability": priceProduct.availability,
				"lastRoomAvailability": priceProduct.lastRoomAvailability,
				"addOnProductIdList": priceProduct.addOnProductIdList,
				"roomCategoryIdList": priceProduct.roomCategoryIdList,
				"price": priceProduct.price,
				"taxIdList": priceProduct.taxIdList,
				"openIntervalList": priceProduct.openIntervalList,
				"openForArrivalIntervalList": priceProduct.openForArrivalIntervalList,
				"openForDepartureIntervalList": priceProduct.openForDepartureIntervalList,
				"yieldFilterList": priceProduct.yieldFilterList,
				"constraints": priceProduct.constraints,
				"conditions": priceProduct.conditions,
				"notes": priceProduct.notes
			});
	}
	public updatePriceProductStatus(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, params: PriceProductUpdateStatusParamsRepoDO): Promise<PriceProductDO> {
		return this.findAndModifyPriceProduct(meta, itemMeta,
			{
				"status": params.oldStatus
			},
			{
				"status": params.newStatus
			});
	}
	public updatePriceProductYieldFiltersAndNotes(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, filterList: PriceProductYieldFilterMetaDO[], notes: string): Promise<PriceProductDO> {
		return this.findAndModifyPriceProduct(meta, itemMeta, {},
			{
				"yieldFilterList": filterList,
				"notes": notes
			});
	}
	public updatePriceProductYieldManagerIntervals(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, intervals: PriceProductUpdateYMIntervalsParamsRepoDO): Promise<PriceProductDO> {
		return this.findAndModifyPriceProduct(meta, itemMeta, {},
			{
				"openIntervalList": intervals.openIntervalList,
				"openForArrivalIntervalList": intervals.openForArrivalIntervalList,
				"openForDepartureIntervalList": intervals.openForDepartureIntervalList
			});
	}

	private findAndModifyPriceProduct(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, findQuery: Object, updateQuery: Object): Promise<PriceProductDO> {
		return new Promise<PriceProductDO>((resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) => {
			this.findAndModifyPriceProductCore(meta, itemMeta, findQuery, updateQuery, resolve, reject);
		});
	}
	private findAndModifyPriceProductCore(meta: PriceProductMetaRepoDO, itemMeta: PriceProductItemMetaRepoDO, findQuery: Object, updateQuery: any, resolve: { (result: PriceProductDO): void }, reject: { (err: ThError): void }) {
		updateQuery.$inc = { "versionId": 1 };
		findQuery["hotelId"] = meta.hotelId;
		findQuery["id"] = itemMeta.id;
		findQuery["versionId"] = itemMeta.versionId;

		this.findAndModifyDocument(findQuery, updateQuery,
			() => {
				var thError = new ThError(ThStatusCode.PriceProductRepositoryProblemUpdatingPriceProduct, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating price product - concurrency", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.PriceProductRepositoryErrorUpdatingPriceProduct, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error updating price product", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(updatedDBPriceProduct: Object) => {
				resolve(this._helper.buildPriceProductDOFrom(updatedDBPriceProduct));
			}
		);
	}
}