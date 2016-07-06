import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {GenerateCustomerInvoiceGroupItemDO} from './GenerateCustomerInvoiceGroupItemDO';
import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';

export class GenerateCustomerInvoiceGroupItem {
    private _thUtils: ThUtils;
    private _generateCustomerInvoiceGroupDO: GenerateCustomerInvoiceGroupItemDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public generate(generateCustomerInvoiceGroupDO: GenerateCustomerInvoiceGroupItemDO): Promise<InvoiceGroupDO> {
        this._generateCustomerInvoiceGroupDO = generateCustomerInvoiceGroupDO;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.generateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.GenerateCustomerInvoiceGroupItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error generating customer related invoice gorup", this._generateCustomerInvoiceGroupDO, thError);
                reject(thError);
            }
        });
    }

    private generateCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = GenerateCustomerInvoiceGroupItemDO.getValidationStructure().validateStructure(this._generateCustomerInvoiceGroupDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._generateCustomerInvoiceGroupDO);
            parser.logAndReject("Error validating data for generating customer related invoice group", reject);
            return;
        }
    }    
}