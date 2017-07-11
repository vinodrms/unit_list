import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {AddOnProductSearchResultRepoDO} from '../../../data-layer/add-on-products/repositories/IAddOnProductRepository';
import {AddOnProductDO} from '../../../data-layer/add-on-products/data-objects/AddOnProductDO';
import {AddOnProductsContainer} from './results/AddOnProductsContainer';

import _ = require("underscore");

export class AddOnProductIdValidator {
	private _thUtils: ThUtils;
	private _addOnProductIdList: string[];

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public validateAddOnProductIdList(addOnProductIdList: string[]): Promise<AddOnProductsContainer> {
		this._addOnProductIdList = addOnProductIdList;
		return new Promise<AddOnProductsContainer>((resolve: { (result: AddOnProductsContainer): void }, reject: { (err: ThError): void }) => {
			this.validateAddOnProductIdListCore(resolve, reject);
		});
	}

	private validateAddOnProductIdListCore(resolve: { (result: AddOnProductsContainer): void }, reject: { (err: ThError): void }) {
		var addOnProductRepo = this._appContext.getRepositoryFactory().getAddOnProductRepository();
		addOnProductRepo.getAddOnProductList({ hotelId: this._sessionContext.sessionDO.hotel.id }, { addOnProductIdList: this._addOnProductIdList })
			.then((searchResult: AddOnProductSearchResultRepoDO) => {
				var validAddOnProductIdList: string[] = this.getIdList(searchResult.addOnProductList);
				if (!this._thUtils.firstArrayIncludedInSecond(this._addOnProductIdList, validAddOnProductIdList)) {
					var thError = new ThError(ThStatusCode.AddOnProductIdValidatorInvalidId, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Invalid add on product id list", this._addOnProductIdList, thError);
					throw thError;
				}
				resolve(new AddOnProductsContainer(searchResult.addOnProductList));
			}).catch((error: any) => {
				reject(error);
			});
	}
	private getIdList(addOnProductList: AddOnProductDO[]): string[] {
		return _.map(addOnProductList, (addOnProduct: AddOnProductDO) => {
			return addOnProduct.id;
		});
	}
}