import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../../common/base/MongoRepository';
import {AddOnProductMetaRepoDO, AddOnProductItemMetaRepoDO} from '../../IAddOnProductRepository';
import {AddOnProductDO, AddOnProductStatus} from '../../../data-objects/AddOnProductDO';
import {AddOnProductRepositoryHelper} from './helpers/AddOnProductRepositoryHelper';

export class MongoAddOnProductCrudOperationsRepository extends MongoRepository {
	private _helper: AddOnProductRepositoryHelper;

    constructor(private _addOnProdEntity: Sails.Model) {
        super(_addOnProdEntity);
		this._helper = new AddOnProductRepositoryHelper();
    }
	public addAddOnProduct(meta: AddOnProductMetaRepoDO, addOnProduct: AddOnProductDO): Promise<AddOnProductDO> {
		return new Promise<AddOnProductDO>((resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) => {
			this.addOnProductCore(meta, addOnProduct, resolve, reject);
		});
	}
	private addOnProductCore(meta: AddOnProductMetaRepoDO, addOnProduct: AddOnProductDO, resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) {
		addOnProduct.hotelId = meta.hotelId;
		addOnProduct.versionId = 0;
		addOnProduct.status = AddOnProductStatus.Active;

		this.createDocument(addOnProduct,
			(err: Error) => {
				this.logAndReject(err, reject, { meat: meta, addOnProduct: addOnProduct }, ThStatusCode.MongoAddOnProductRepositoryErrorAddingAddOnProduct);
			},
			(createdAddOnProduct: Object) => {
				resolve(this._helper.buildAddOnProductDOFrom(createdAddOnProduct));
			}
		);
	}

	public getAddOnProductById(meta: AddOnProductMetaRepoDO, addOnProductId: string): Promise<AddOnProductDO> {
		return new Promise<AddOnProductDO>((resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) => {
			this.getAddOnProductByIdCore(meta, addOnProductId, resolve, reject);
		});
	}
	private getAddOnProductByIdCore(meta: AddOnProductMetaRepoDO, addOnProductId: string, resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) {
		this.findOneDocument({ "hotelId": meta.hotelId, "id": addOnProductId },
			() => {
				var thError = new ThError(ThStatusCode.MongoAddOnProductRepositoryProductNotFound, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Add on product not found", { meta: meta, addOnProductId: addOnProductId }, thError);
				reject(thError);
			},
			(err: Error) => {
				var thError = new ThError(ThStatusCode.MongoAddOnProductRepositoryErrorGettingAddOnProduct, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting add on product by id", { meta: meta, addOnProductId: addOnProductId }, thError);
				reject(thError);
			},
			(foundAddOnProduct: Object) => {
				resolve(this._helper.buildAddOnProductDOFrom(foundAddOnProduct));
			}
		);
	}
	public updateAddOnProduct(meta: AddOnProductMetaRepoDO, itemMeta: AddOnProductItemMetaRepoDO, addOnProduct: AddOnProductDO): Promise<AddOnProductDO> {
		return this.findAndModifyAddOnProduct(meta, itemMeta,
			{
				"categoryId": addOnProduct.categoryId,
				"name": addOnProduct.name,
				"price": addOnProduct.price,
				"taxIdList": addOnProduct.taxIdList,
				"description": addOnProduct.description
			});
	}
	public deleteAddOnProduct(meta: AddOnProductMetaRepoDO, itemMeta: AddOnProductItemMetaRepoDO): Promise<AddOnProductDO> {
		return this.findAndModifyAddOnProduct(meta, itemMeta,
			{
				"status": AddOnProductStatus.Deleted
			});
	}
	private findAndModifyAddOnProduct(meta: AddOnProductMetaRepoDO, itemMeta: AddOnProductItemMetaRepoDO, updateQuery: Object): Promise<AddOnProductDO> {
		return new Promise<AddOnProductDO>((resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) => {
			this.findAndModifyAddOnProductCore(meta, itemMeta, updateQuery, resolve, reject);
		});
	}
	private findAndModifyAddOnProductCore(meta: AddOnProductMetaRepoDO, itemMeta: AddOnProductItemMetaRepoDO, updateQuery: any, resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) {
		updateQuery.$inc = { "versionId": 1 };
		var findQuery: Object[] = [
			{ "hotelId": meta.hotelId },
			{ "id": itemMeta.id },
			{ "versionId": itemMeta.versionId }
		];
		this.findAndModifyDocument({ $and: findQuery }, updateQuery,
			() => {
				var thError = new ThError(ThStatusCode.MongoAddOnProductRepositoryProblemUpdatingAddOnProduct, null);
				ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating add on product - concurrency", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
				reject(thError);
			},
			(err: Error) => {
				this.logAndReject(err, reject, { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, ThStatusCode.MongoAddOnProductRepositoryErrorUpdatingAddOnProduct);
			},
			(updatedDBAddOnProduct: Object) => {
				resolve(this._helper.buildAddOnProductDOFrom(updatedDBAddOnProduct));
			}
		);
	}
	private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
		var errorCode = this.getMongoErrorCode(err);
		if (errorCode == MongoErrorCodes.DuplicateKeyError) {
			var thError = new ThError(ThStatusCode.MongoAddOnProductRepositoryNameAlreadyExists, err);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Add on product name already exists", context, thError);
			reject(thError);
			return;
		}
		var thError = new ThError(defaultStatusCode, err);
		ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding add on product", context, thError);
		reject(thError);
	}
}