import {InvoiceGroupDO} from '../../../data-objects/InvoiceGroupDO';

export class InvoiceGroupsRepositoryHelper {
    constructor() {
    }
    public buildInvoiceGroupDOFrom(dbInvoiceGroup: Object): InvoiceGroupDO {
		var invoiceGroup: InvoiceGroupDO = new InvoiceGroupDO();
		invoiceGroup.buildFromObject(dbInvoiceGroup);
		return invoiceGroup;
	}
	public buildInvoiceGroupListFrom(dbInvoiceGroupList: Array<Object>): InvoiceGroupDO[] {
		var list: InvoiceGroupDO[] = [];
		dbInvoiceGroupList.forEach((dbInvoiceGroup: Object) => {
			list.push(this.buildInvoiceGroupDOFrom(dbInvoiceGroup));
		});
		return list;
	}   
}