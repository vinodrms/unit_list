import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThUtils} from '../../../../utils/ThUtils';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {AddNewCustomerInvoiceDO} from './AddNewCustomerInvoiceDO';
import {InvoiceGroupDO} from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';

export class AddNewCustomerInvoice {
    private _thUtils: ThUtils;
    private _addNewCustomerInvoiceItemDO: AddNewCustomerInvoiceDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public addNewCustomerInvoiceItem(addNewCustomerInvoiceItemDO: AddNewCustomerInvoiceDO): Promise<InvoiceGroupDO> {
        this._addNewCustomerInvoiceItemDO = addNewCustomerInvoiceItemDO;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.addNewCustomerInvoiceItemCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.AddNewCustomerInvoiceGroupError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding new customer related invoice gorup", this._addNewCustomerInvoiceItemDO, thError);
                reject(thError);
            }
        });
    }

    private addNewCustomerInvoiceItemCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = AddNewCustomerInvoiceDO.getValidationStructure().validateStructure(this._addNewCustomerInvoiceItemDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._addNewCustomerInvoiceItemDO);
            parser.logAndReject("Error validating data for adding new customer related invoice group", reject);
            return;
        }
    }    
}