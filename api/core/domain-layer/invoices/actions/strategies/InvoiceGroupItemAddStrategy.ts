import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';

import {InvoiceGroupDO} from '../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {InvoiceGroupMetaRepoDO} from '../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import {IInvoiceGroupItemActionStrategy} from '../IInvoiceGroupItemActionStrategy';

export class InvoiceGroupItemAddStrategy implements IInvoiceGroupItemActionStrategy {
    
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _invoiceGroupDO: InvoiceGroupDO) {
	}
    public save(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
		var invoiceGroupsRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
		var invoiceGroupMeta = this.buildInvoiceGroupMetaRepoDO();
		invoiceGroupsRepo.addInvoiceGroup(invoiceGroupMeta, this._invoiceGroupDO).then((result: InvoiceGroupDO) => {
			resolve(result);
		}).catch((err: any) => {
			reject(err);
		});
	}
	private buildInvoiceGroupMetaRepoDO(): InvoiceGroupMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		};
	}
}