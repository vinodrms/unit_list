import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {IInvoiceGroupItemActionStrategy} from './IInvoiceGroupItemActionStrategy';
import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceGroupItemAddStrategy} from './strategies/InvoiceGroupItemAddStrategy';
import {InvoiceGroupItemUpdateStrategy} from './strategies/InvoiceGroupItemUpdateStrategy';

export class InvoiceGroupItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(invoiceGroupDO: InvoiceGroupDO): IInvoiceGroupItemActionStrategy {
		if (this._thUtils.isUndefinedOrNull(invoiceGroupDO.id)) {
			return new InvoiceGroupItemAddStrategy(this._appContext, this._sessionContext, invoiceGroupDO);
		}
		return new InvoiceGroupItemUpdateStrategy(this._appContext, this._sessionContext, invoiceGroupDO);
	}
}