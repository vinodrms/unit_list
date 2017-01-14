import { ThUtils } from '../../../../utils/ThUtils';
import { AppContext } from '../../../../utils/AppContext';
import { SessionContext } from '../../../../utils/SessionContext';
import { ISaveInvoiceGroupActionStrategy } from './ISaveInvoiceGroupActionStrategy';

import { InvoiceGroupDO } from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import { InvoiceGroupUpdateStrategy } from './strategies/InvoiceGroupUpdateStrategy';
import { InvoiceGroupAddStrategy } from './strategies/InvoiceGroupAddStrategy';

export class SaveInvoiceGroupActionFactory {
    private _thUtils: ThUtils;
    private _invoiceGroup: InvoiceGroupDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public getActionStrategy(invoiceGroup: InvoiceGroupDO): ISaveInvoiceGroupActionStrategy {
        if (!this._thUtils.isUndefinedOrNull(invoiceGroup.id)) {
            return new InvoiceGroupUpdateStrategy(this._appContext, this._sessionContext, invoiceGroup);
        }
        return new InvoiceGroupAddStrategy(this._appContext, this._sessionContext, invoiceGroup);
    }
}