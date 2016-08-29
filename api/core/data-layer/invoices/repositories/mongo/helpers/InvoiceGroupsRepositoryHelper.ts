import {InvoiceGroupDO} from '../../../data-objects/InvoiceGroupDO';
import {IBookingRepository} from '../../../../bookings/repositories/IBookingRepository';

export class InvoiceGroupsRepositoryHelper {
    constructor() {
    }
    public buildInvoiceGroupDOFrom(dbInvoiceGroup: Object): InvoiceGroupDO {
		var invoiceGroup: InvoiceGroupDO = new InvoiceGroupDO();
		invoiceGroup.buildFromObject(dbInvoiceGroup);
		return invoiceGroup;
	}
}