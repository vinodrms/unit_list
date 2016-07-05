import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ValidationResultParser} from '../../common/ValidationResultParser';
import {GenerateBookingInvoiceGroupItemDO} from './GenerateBookingInvoiceGroupItemDO';
import {InvoiceGroupDO} from '../../../data-layer/invoices/data-objects/InvoiceGroupDO';

export class GenerateBookingInvoiceGroupItem {
    private _thUtils: ThUtils;
    private _generateBookingInvoiceGroupDO: GenerateBookingInvoiceGroupItemDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public generate(generateBookingInvoiceGroupDO: GenerateBookingInvoiceGroupItemDO): Promise<InvoiceGroupDO> {
        this._generateBookingInvoiceGroupDO = generateBookingInvoiceGroupDO;

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.generateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.GenerateBookingInvoiceGroupItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error generating booking related invoice gorup", this._generateBookingInvoiceGroupDO, thError);
                reject(thError);
            }
        });
    }

    private generateCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var validationResult = GenerateBookingInvoiceGroupItemDO.getValidationStructure().validateStructure(this._generateBookingInvoiceGroupDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._generateBookingInvoiceGroupDO);
            parser.logAndReject("Error validating data for generating booking related invoice group", reject);
            return;
        }
    }
}