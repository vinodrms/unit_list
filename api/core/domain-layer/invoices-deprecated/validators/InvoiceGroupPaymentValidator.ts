import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThUtils} from '../../../utils/ThUtils';
import {InvoiceGroupDO} from '../../../data-layer/invoices-deprecated/data-objects/InvoiceGroupDO';
import {AddOnProductsContainer} from '../../../domain-layer/add-on-products/validators/results/AddOnProductsContainer';
import {CustomersContainer} from '../../../domain-layer/customers/validators/results/CustomersContainer';
import {PriceProductsContainer} from '../../../domain-layer/price-products/validators/results/PriceProductsContainer';

import _ = require('underscore');

//TODO Implement invoice group payment validator
export class InvoiceGroupPaymentValidator {
    private _thUtils: ThUtils;
    private _invoiceGroup: InvoiceGroupDO;

    constructor(private _customersContainer: CustomersContainer, private _aopsContainer: AddOnProductsContainer, private _ppsContainer: PriceProductsContainer) {
        this._thUtils = new ThUtils();
    }

    public validate(invoice: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.validateCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.InvoicePaymentValidatorError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error validating payment", this._invoiceGroup, thError);
                reject(thError);
            }
        });
    }

    private validateCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {

    }

}
