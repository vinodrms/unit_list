import {AHotelOperationsPageParam} from '../../../../services/utils/AHotelOperationsPageParam';
import {HotelOperationsPageType} from '../../../../services/utils/HotelOperationsPageType';

export interface HotelInvoiceOperationsPageFilterParam {
    invoiceId?: string;
    customerId?: string;
    bookingId?: string;
}

export class HotelInvoiceOperationsPageParam extends AHotelOperationsPageParam {
    private static InvoiceFontName = "L";
    invoiceGroupId: string;
    invoiceFilter: HotelInvoiceOperationsPageFilterParam;

    constructor(invoiceGroupId: string, invoiceFilter: HotelInvoiceOperationsPageFilterParam) {
        super(HotelOperationsPageType.InvoiceOperations, HotelInvoiceOperationsPageParam.InvoiceFontName);
        this.invoiceGroupId = invoiceGroupId;
        this.invoiceFilter = invoiceFilter;
    }
}