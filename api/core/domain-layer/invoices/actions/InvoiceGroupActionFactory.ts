import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';

import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {IInvoiceGroupActionStrategy} from './IInvoiceGroupActionStrategy';
import {InvoiceGroupAddStrategy} from './strategies/InvoiceGroupAddStrategy';
import {InvoiceGroupUpdateStrategy} from './strategies/InvoiceGroupUpdateStrategy';

export class InvoiceGroupActionFactory {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public getActionStrategy(invoiceGroupDO: InvoiceGroupDO): IInvoiceGroupActionStrategy {
		if (this._thUtils.isUndefinedOrNull(invoiceGroupDO.id)) {
			return new InvoiceGroupAddStrategy(this._appContext, this._sessionContext, invoiceGroupDO);
		}
		return new InvoiceGroupUpdateStrategy(this._appContext, this._sessionContext, invoiceGroupDO);
	}
}