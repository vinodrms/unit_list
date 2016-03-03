import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {CustomerDO} from '../../../../data-layer/customers/data-objects/CustomerDO';
import {CustomerMetaRepoDO, CustomerItemMetaRepoDO} from '../../../../data-layer/customers/repositories/ICustomerRepository';
import {ICustomerItemActionStrategy} from '../ICustomerItemActionStrategy';

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
}