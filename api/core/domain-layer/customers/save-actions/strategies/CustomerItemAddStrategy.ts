import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {CustomerDO} from '../../../../data-layer/customers/data-objects/CustomerDO';
import {CustomerMetaRepoDO} from '../../../../data-layer/customers/repositories/ICustomerRepository';
import {ICustomerItemActionStrategy} from '../ICustomerItemActionStrategy';

export class CustomerItemAddStrategy implements ICustomerItemActionStrategy {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _customerDO: CustomerDO, private _customerMetaRepo: CustomerMetaRepoDO) {
		this._thUtils = new ThUtils();
	}

	public save(resolve: { (result: CustomerDO): void }, reject: { (err: ThError): void }) {
		this.prepareCustomerForAdd();
		var custRepo = this._appContext.getRepositoryFactory().getCustomerRepository();
		custRepo.addCustomer(this._customerMetaRepo, this._customerDO).then((addedCustomer: CustomerDO) => {
			resolve(addedCustomer);
		}).catch((err: any) => {
			reject(err);
		});
	}
	private prepareCustomerForAdd() {
		this._customerDO.priceProductDetails.bookingCode = this._thUtils.generateUniqueID();
	}
}