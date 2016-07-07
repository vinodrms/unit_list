import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {AddNewCustomerInvoiceGroupDO} from './AddNewCustomerInvoiceGroupDO';
import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';

export class AddNewCustomerInvoiceGroup {
    private _thUtils: ThUtils;
    private _addNewCustomerInvoiceGroupDO: AddNewCustomerInvoiceGroupDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public addNewCustomerInvoiceGroup(addNewCustomerInvoiceGroupDO: AddNewCustomerInvoiceGroupDO): Promise<InvoiceGroupDO> {
        this._addNewCustomerInvoiceGroupDO = addNewCustomerInvoiceGroupDO;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.addNewCustomerInvoiceGroupCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.AddNewCustomerInvoiceGroupError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding new customer related invoice gorup", this._addNewCustomerInvoiceGroupDO, thError);
                reject(thError);
            }
        });
    }

    private addNewCustomerInvoiceGroupCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = AddNewCustomerInvoiceGroupDO.getValidationStructure().validateStructure(this._addNewCustomerInvoiceGroupDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._addNewCustomerInvoiceGroupDO);
            parser.logAndReject("Error validating data for adding new customer related invoice group", reject);
            return;
        }
    }    
}