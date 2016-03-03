import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {CustomerDO} from '../../../data-layer/customers/data-objects/CustomerDO';
import {CustomerMetaRepoDO} from '../../../data-layer/customers/repositories/ICustomerRepository';
import {ICustomerItemActionStrategy} from './ICustomerItemActionStrategy';
import {CustomerItemAddStrategy} from './strategies/CustomerItemAddStrategy';
import {CustomerItemUpdateStrategy} from './strategies/CustomerItemUpdateStrategy';

export class CustomerItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(customerDO: CustomerDO, customerMetaRepo: CustomerMetaRepoDO): ICustomerItemActionStrategy {
		if (this._thUtils.isUndefinedOrNull(customerDO.id)) {
			return new CustomerItemAddStrategy(this._appContext, this._sessionContext, customerDO, customerMetaRepo);
		}
		return new CustomerItemUpdateStrategy(this._appContext, this._sessionContext, customerDO, customerMetaRepo);
	}
}