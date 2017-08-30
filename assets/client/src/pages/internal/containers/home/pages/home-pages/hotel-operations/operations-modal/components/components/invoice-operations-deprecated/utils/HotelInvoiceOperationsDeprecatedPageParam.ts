import {AHotelOperationsPageParam} from '../../../../services/utils/AHotelOperationsPageParam';
import {HotelOperationsPageType} from '../../../../services/utils/HotelOperationsPageType';

export interface HotelInvoiceOperationsDeprecatedPageFilterParam {
    invoiceId?: string;
    customerId?: string;
    bookingId?: string;
}

export class HotelInvoiceOperationsDeprecatedPageParam extends AHotelOperationsPageParam {
    private static InvoiceFontName = "L";
    invoiceGroupId: string;
    invoiceFilter: HotelInvoiceOperationsDeprecatedPageFilterParam;
    openInEditMode: boolean;

    constructor(invoiceGroupId: string, invoiceFilter: HotelInvoiceOperationsDeprecatedPageFilterParam, openInEditMode: boolean) {
        super(HotelOperationsPageType.InvoiceOperationsDeprecated, HotelInvoiceOperationsDeprecatedPageParam.InvoiceFontName);
        this.invoiceGroupId = invoiceGroupId;
        this.invoiceFilter = invoiceFilter;
        this.openInEditMode = openInEditMode;
    }

    
}