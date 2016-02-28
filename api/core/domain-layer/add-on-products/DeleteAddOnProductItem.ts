import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {IValidationStructure} from '../../utils/th-validation/structure/core/IValidationStructure';
import {ObjectValidationStructure} from '../../utils/th-validation/structure/ObjectValidationStructure';
import {PrimitiveValidationStructure} from '../../utils/th-validation/structure/PrimitiveValidationStructure';
import {StringValidationRule} from '../../utils/th-validation/rules/StringValidationRule';
import {AddOnProductMetaRepoDO, AddOnProductItemMetaRepoDO} from '../../data-layer/add-on-products/repositories/IAddOnProductRepository';
import {AddOnProductDO} from '../../data-layer/add-on-products/data-objects/AddOnProductDO';

export class DeleteAddOnProductItemDO {
	id: string;
	public static getValidationStructure(): IValidationStructure {
		return new ObjectValidationStructure([
			{
				key: "id",
				validationStruct: new PrimitiveValidationStructure(new StringValidationRule())
			}
		])
	}
}

export class DeleteAddOnProductItem {
	private _aopMeta: AddOnProductMetaRepoDO;
	private _deleteItemDO: DeleteAddOnProductItemDO;

	private _loadedAddOnProduct: AddOnProductDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._aopMeta = {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}

	public delete(deleteItemDO: DeleteAddOnProductItemDO): Promise<AddOnProductDO> {
		this._deleteItemDO = deleteItemDO;

		return new Promise<AddOnProductDO>((resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.deleteCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.DeleteAddOnProductItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting add on product", this._deleteItemDO, thError);
				reject(thError);
			}
		});
	}
	private deleteCore(resolve: { (result: AddOnProductDO): void }, reject: { (err: ThError): void }) {
		var validationResult = DeleteAddOnProductItemDO.getValidationStructure().validateStructure(this._deleteItemDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._deleteItemDO);
			parser.logAndReject("Error validating data for delete add on product", reject);
			return;
		}
		var addOnProductRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
		addOnProductRepo.getAddOnProductById(this._aopMeta, this._deleteItemDO.id)
			.then((result: AddOnProductDO) => {
				this._loadedAddOnProduct = result;

				return this.validateLoadedAddOnProduct();
			})
			.then((validationResult: boolean) => {
				var addOnProductRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
				var itemMeta = this.buildAddOnProductItemMetaRepoDO();
				return addOnProductRepo.deleteAddOnProduct(this._aopMeta, itemMeta);
			})
			.then((deletedAddOnProduct: AddOnProductDO) => {
				resolve(deletedAddOnProduct);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.DeleteAddOnProductItemError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error deleting add on produce", this._deleteItemDO, thError);
				}
				reject(thError);
			});
	}
	private buildAddOnProductItemMetaRepoDO(): AddOnProductItemMetaRepoDO {
		return {
			id: this._loadedAddOnProduct.id,
			versionId: this._loadedAddOnProduct.versionId
		};
	}
	private validateLoadedAddOnProduct(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			try {
				this.validateLoadedAddOnProductCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.DeleteAddOnProductItemErrorValidating, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error validating loaded add on produce", this._loadedAddOnProduct, thError);
				reject(thError);
			}
		});
	}
	private validateLoadedAddOnProductCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		// TODO: add validations for deleting addon product (eg: if it is used in existing price products or open invoices)
		resolve(true);
	}
}