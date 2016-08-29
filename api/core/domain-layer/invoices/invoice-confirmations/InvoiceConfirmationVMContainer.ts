import {ThTranslation} from '../../../utils/localization/ThTranslation';
import {ThUtils} from '../../../../core/utils/ThUtils';

import {InvoiceConfirmationVM} from './InvoiceConfirmationVM';
import {InvoiceAggregatedDataContainer} from '../aggregators/InvoiceAggregatedDataContainer';

export class InvoiceConfirmationVMContainer {
    private _thUtils: ThUtils;

    invoiceReference: string;
    payerIndex: number;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();

        this.invoiceReference = 'ref';
        this.payerIndex = 1;
    }

    public buildFromInvoiceAggregatedDataContainer(invoiceAggregatedDataContainer: InvoiceAggregatedDataContainer) {
        
    }
}