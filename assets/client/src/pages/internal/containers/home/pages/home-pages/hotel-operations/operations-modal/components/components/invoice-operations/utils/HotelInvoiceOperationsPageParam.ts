import { AHotelOperationsPageParam } from '../../../../services/utils/AHotelOperationsPageParam';
import { HotelOperationsPageType } from '../../../../services/utils/HotelOperationsPageType';

export interface HotelInvoiceOperationsPageFilterParam {
    customerId?: string;
}

export class HotelInvoiceOperationsPageParam extends AHotelOperationsPageParam {
    private static InvoiceFontName = "L";

    constructor(public invoiceId: string, public invoiceFilter: HotelInvoiceOperationsPageFilterParam) {
        super(HotelOperationsPageType.InvoiceOperations, HotelInvoiceOperationsPageParam.InvoiceFontName);
    }
}
