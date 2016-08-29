import {HotelDO} from '../../../data-layer/hotel/data-objects/HotelDO';
import {InvoiceAggregatedData} from './InvoiceAggregatedData';

export class InvoiceAggregatedDataContainer {
    hotel: HotelDO;
    ccySymbol: string;
    
    invoiceAggregatedData: InvoiceAggregatedData;
}