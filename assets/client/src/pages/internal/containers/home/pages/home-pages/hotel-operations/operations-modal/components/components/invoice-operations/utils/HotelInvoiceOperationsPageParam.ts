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
    openInEditMode: boolean;

    constructor(invoiceGroupId: string, invoiceFilter: HotelInvoiceOperationsPageFilterParam, openInEditMode: boolean) {
        super(HotelOperationsPageType.InvoiceOperations, HotelInvoiceOperationsPageParam.InvoiceFontName);
        this.invoiceGroupId = invoiceGroupId;
        this.invoiceFilter = invoiceFilter;
        this.openInEditMode = openInEditMode;
    }

    
}