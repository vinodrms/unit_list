import {ThTranslation} from '../../../utils/localization/ThTranslation';
import {ThUtils} from '../../../../core/utils/ThUtils';

import {InvoiceConfirmationVM} from './InvoiceConfirmationVM';
import {InvoiceAggregatedDataContainer} from '../aggregators/InvoiceAggregatedDataContainer';

export class InvoiceConfirmationVMContainer {
    private _thUtils: ThUtils;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
    }

    public buildFromInvoiceAggregatedDataContainer(invoiceAggregatedDataContainer: InvoiceAggregatedDataContainer) {
        
    }
}