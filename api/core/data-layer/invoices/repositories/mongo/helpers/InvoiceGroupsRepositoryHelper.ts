import {InvoiceGroupDO} from '../../../data-objects/InvoiceGroupDO';
import {IBookingRepository} from '../../../../bookings/repositories/IBookingRepository';

export class InvoiceGroupsRepositoryHelper {
    constructor(private _bookingsRepo: IBookingRepository) {
    }
    public buildInvoiceGroupDOFrom(dbInvoiceGroup: Object): InvoiceGroupDO {
		var invoiceGroup: InvoiceGroupDO = new InvoiceGroupDO(this._bookingsRepo);
		invoiceGroup.buildFromObject(dbInvoiceGroup);
		return invoiceGroup;
	}
}