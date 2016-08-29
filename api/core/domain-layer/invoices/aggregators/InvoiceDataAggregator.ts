import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThUtils} from '../../../utils/ThUtils';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';

import {InvoiceAggregatedDataContainer} from './InvoiceAggregatedDataContainer';
import {InvoiceAggregatedData} from './InvoiceAggregatedData';

export interface InvoiceDataAggregatorQuery {
    
}

export class InvoiceDataAggregator {
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
    }

    public getInvoiceAggregatedDataContainer(query: InvoiceDataAggregatorQuery): Promise<InvoiceAggregatedDataContainer> {
        return new Promise<InvoiceAggregatedDataContainer>((resolve: { (result: InvoiceAggregatedDataContainer): void }, reject: { (err: ThError): void }) => {
            this.getInvoiceAggregatedDataContainerCore(resolve, reject, query);
        });
    }

    private getInvoiceAggregatedDataContainerCore(resolve: { (result: InvoiceAggregatedDataContainer): void }, reject: { (err: ThError): void }, query: InvoiceAggregatedDataContainer) {
        resolve({});
    }
}