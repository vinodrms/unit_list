import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {ThUtils} from '../../utils/ThUtils';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {CustomerDO, CustomerType} from '../../data-layer/customers/data-objects/CustomerDO';
import {SaveCustomerItemDO} from './SaveCustomerItemDO';
import {CustomerMetaRepoDO, CustomerSearchResultRepoDO} from '../../data-layer/customers/repositories/ICustomerRepository';
import {PriceProductAvailability} from '../../data-layer/price-products/data-objects/PriceProductDO';
import {CustomerItemActionFactory} from './save-actions/CustomerItemActionFactory';
import {ICustomerItemActionStrategy} from './save-actions/ICustomerItemActionStrategy';
import {PriceProductIdValidator} from '../price-products/validators/PriceProductIdValidator';

import _ = require("underscore");

export class SaveCustomerItem {
	private _thUtils: ThUtils;
	private _saveCustomerDO: SaveCustomerItemDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public save(saveCustomerDO: SaveCustomerItemDO): Promise<CustomerDO> {
		this._saveCustomerDO = saveCustomerDO;
		return new Promise<CustomerDO>((resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.saveCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.SaveCustomerItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error saving customer", this._saveCustomerDO, thError);
				reject(thError);
			}
		});
	}
	private saveCore(resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) {
		if (this._thUtils.isUndefinedOrNull(this._saveCustomerDO, "type")) {
			var thError = new ThError(ThStatusCode.SaveCustomerItemInvalidOrNullClientType, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Error, "Invalid or null customer type", this._saveCustomerDO, thError);
			reject(thError);
			return;
		}
		var customerType = this._saveCustomerDO.type;
		var validationResult = SaveCustomerItemDO.getValidationStructure(customerType).validateStructure(this._saveCustomerDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._saveCustomerDO);
			parser.logAndReject("Error validating data for save customer", reject);
			return;
		}

		this.validatePriceProductDetails()
			.then((result: boolean) => {
				return this.saveCustomerItem();
			})
			.then((savedCustomer: CustomerDO) => {
				resolve(savedCustomer);
			})
			.catch((error: any) => {
				var thError = new ThError(ThStatusCode.SaveCustomerItemError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error saving customer item", this._saveCustomerDO, thError);
				}
				reject(thError);
			});
	}

	private validatePriceProductDetails(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.validatePriceProductDetailsCore(resolve, reject);
		});
	}
	private validatePriceProductDetailsCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		var priceProductDetails = this._saveCustomerDO.priceProductDetails;

		if (priceProductDetails.priceProductIdList.length == 0) {
			resolve(true);
			return;
		}
		else if (priceProductDetails.priceProductAvailability === PriceProductAvailability.Public) {
			var thError = new ThError(ThStatusCode.SaveCustomerItemCannotSetPriceProductsForPublic, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Cannot set price products for public", this._saveCustomerDO, thError);
			reject(thError);
			return;
		}
		var ppIdValitator = new PriceProductIdValidator(this._appContext, this._sessionContext);
		ppIdValitator.validatePriceProductIdList(priceProductDetails.priceProductIdList).then((result: boolean) => {
			resolve(true);
		}).catch((error: any) => {
			reject(error);
		});
	}

	private saveCustomerItem(): Promise<CustomerDO> {
		return new Promise<CustomerDO>((resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) => {
			this.saveCustomerItemCore(resolve, reject);
		});
	}
	private saveCustomerItemCore(resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) {
		var actionFactory = new CustomerItemActionFactory(this._appContext, this._sessionContext);
		var actionStrategy = actionFactory.getActionStrategy(this.buildCustomerDO(), this.getCustomerMetaRepoDO());
		actionStrategy.save(resolve, reject);
	}
	private buildCustomerDO(): CustomerDO {
		var customer = new CustomerDO();
		customer.buildFromObject(this._saveCustomerDO);
		customer.hotelId = this._sessionContext.sessionDO.hotel.id;
		return customer;
	}

	private getCustomerMetaRepoDO(): CustomerMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		}
	}
}