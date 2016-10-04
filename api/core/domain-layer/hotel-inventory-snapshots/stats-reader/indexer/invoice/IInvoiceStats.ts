import { ThDateDO } from '../../../../../utils/th-dates/data-objects/ThDateDO';
import { RevenueForDate } from '../../data-objects/revenue/RevenueForDate';

export interface IInvoiceStats {
    getRevenueForDate(thDate: ThDateDO): RevenueForDate;
    destroy();
    bookingHasInvoiceWithLossAcceptedByManagement(bookingId: string): boolean;
}