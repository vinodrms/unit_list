import {ThTranslation} from '../../../utils/localization/ThTranslation';
import {ThUtils} from '../../../../core/utils/ThUtils';

import {InvoiceVM} from './InvoiceVM';
import {InvoiceAggregatedDataContainer} from '../aggregators/InvoiceAggregatedDataContainer';

export class InvoiceVMContainer {
    private _thUtils: ThUtils;

    constructor(private _thTranslation: ThTranslation) {
        this._thUtils = new ThUtils();
    }

    public buildFromInvoiceAggregatedDataContainer(invoiceAggregatedDataContainer: InvoiceAggregatedDataContainer) {
        
    }
}