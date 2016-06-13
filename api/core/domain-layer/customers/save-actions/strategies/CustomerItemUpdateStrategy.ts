import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {CustomerDO} from '../../../../data-layer/customers/data-objects/CustomerDO';
import {CustomerMetaRepoDO, CustomerItemMetaRepoDO} from '../../../../data-layer/customers/repositories/ICustomerRepository';
import {ICustomerItemActionStrategy} from '../ICustomerItemActionStrategy';
import {AllotmentStatus} from '../../../../data-layer/allotments/data-objects/AllotmentDO';
import {AllotmentSearchResultRepoDO} from '../../../../data-layer/allotments/repositories/IAllotmentRepository';

import _ = require("underscore");

export class CustomerItemUpdateStrategy implements ICustomerItemActionStrategy {
	private _loadedCustomer: CustomerDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _customerDO: CustomerDO, private _customerMetaRepo: CustomerMetaRepoDO) {
	}

	public save(resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) {
		var custRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
		custRepo.getCustomerById(this._customerMetaRepo, this._customerDO.id)
			.then((loadedCustomer: CustomerDO) => {
				this._loadedCustomer = loadedCustomer;
				this.prepareCustomerForUpdate();
				if (this._loadedCustomer.type !== this._customerDO.type) {
					var thError = new ThError(ThStatusCode.CustomerItemUpdateStrategyCustTypeChanged, null);
					ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Customer type cannot be changed", this._customerDO, thError);
					throw thError;
				}
				return this.checkPossibleAllotments();
			})
			.then((allotmentValidationResult: boolean) => {
				var custRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
				var itemMeta = this.buildCustomerItemMetaRepoDO();
				return custRepo.updateCustomer(this._customerMetaRepo, itemMeta, this._customerDO);
			})
			.then((updatedCustomer: CustomerDO) => {
				resolve(updatedCustomer);
			}).catch((error: any) => {
				var thError = new ThError(ThStatusCode.CustomerItemUpdateStrategyError, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating customer", this._customerDO, thError);
				}
				reject(thError);
			});
	}
	private prepareCustomerForUpdate() {
		this._customerDO.priceProductDetails.bookingCode = this._loadedCustomer.priceProductDetails.bookingCode;
	}
	private buildCustomerItemMetaRepoDO(): CustomerItemMetaRepoDO {
		return {
			id: this._loadedCustomer.id,
			versionId: this._loadedCustomer.versionId
		}
	}
	private checkPossibleAllotments(): Promise<boolean> {
		return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: ThError): void }) => {
			this.checkPossibleAllotmentsCore(resolve, reject);
		});
	}
	private checkPossibleAllotmentsCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
		var previousPriceProductIdList = this._loadedCustomer.priceProductDetails.priceProductIdList;
		var currentPriceProductIdList = this._customerDO.priceProductDetails.priceProductIdList;
		var deletedPriceProductIdList = _.difference(previousPriceProductIdList, currentPriceProductIdList);
		if (deletedPriceProductIdList.length == 0) {
			resolve(true);
			return;
		}
		var allotmentRepo = this._appContext.getRepositoryFactory().getAllotmentRepository();
		allotmentRepo.getAllotmentList({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
			priceProductIdList: deletedPriceProductIdList,
			status: AllotmentStatus.Active
		}).then((searchResult: AllotmentSearchResultRepoDO) => {
			if (searchResult.allotmentList.length > 0) {
				var thError = new ThError(ThStatusCode.CustomerItemUpdateStrategyPriceProductUsedInAllotment, null);
				reject(thError);
				return;
			}
			resolve(true);
		}).catch((err: any) => {
			reject(err);
		})
	}
}