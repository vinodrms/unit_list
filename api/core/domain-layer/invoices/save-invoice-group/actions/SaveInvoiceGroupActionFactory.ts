import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThUtils} from '../../../../utils/ThUtils';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {ISaveInvoiceGroupActionStrategy} from './ISaveInvoiceGroupActionStrategy';

import {InvoiceGroupDO} from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {BookingInvoiceGroupUpdateStrategy} from './strategies/BookingInvoiceGroupUpdateStrategy';
import {CustomerInvoiceGroupAddStrategy} from './strategies/CustomerInvoiceGroupAddStrategy';
import {CustomerInvoiceGroupUpdateStrategy} from './strategies/CustomerInvoiceGroupUpdateStrategy';

export class SaveInvoiceGroupActionFactory {
    private _thUtils: ThUtils;
    private _invoiceGroup: InvoiceGroupDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public getActionStrategy(invoiceGroup: InvoiceGroupDO): ISaveInvoiceGroupActionStrategy {
        if (!this._thUtils.isUndefinedOrNull(invoiceGroup.id)) {
			return new BookingInvoiceGroupUpdateStrategy(this._appContext, this._sessionContext, invoiceGroup);
		}
		return new CustomerInvoiceGroupAddStrategy(this._appContext, this._sessionContext, invoiceGroup);
    }
}