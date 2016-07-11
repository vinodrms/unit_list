import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {ThError} from '../../../../utils/th-responses/ThError';

import {InvoiceGroupDO} from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {IInvoiceGroupActionStrategy} from '../IInvoiceGroupActionStrategy';

export class InvoiceGroupUpdateStrategy implements IInvoiceGroupActionStrategy {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
        private _invoiceGroupDO: InvoiceGroupDO) {
        this._thUtils = new ThUtils();
    }

    public save(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        
    }
}