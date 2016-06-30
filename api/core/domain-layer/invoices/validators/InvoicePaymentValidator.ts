import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../utils/ThUtils';
import {InvoiceDO} from '../../../data-layer/invoices/data-objects/InvoiceDO';
import {AddOnProductsContainer} from '../../../domain-layer/add-on-products/validators/results/AddOnProductsContainer';
import {CustomersContainer} from '../../../domain-layer/customers/validators/results/CustomersContainer';
import {PriceProductsContainer} from '../../../domain-layer/price-products/validators/results/PriceProductsContainer';

import _ = require('underscore');

export class InvoicePaymentValidator {
    private _thUtils: ThUtils;
    private _invoice: InvoiceDO;

    constructor(private _customersContainer: CustomersContainer, private _aopsContainer: AddOnProductsContainer, private _ppsContainer: PriceProductsContainer) {
        this._thUtils = new ThUtils();
    }

    public validate(invoice: InvoiceDO): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.validateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.InvoicePaymentValidatorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error validating payment", this._invoice, thError);
                reject(thError);
            }
        });
    }

    private validateCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        
    }

}