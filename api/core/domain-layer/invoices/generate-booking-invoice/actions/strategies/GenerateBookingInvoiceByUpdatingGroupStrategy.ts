import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';

import {InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO} from '../../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';
import {InvoiceGroupDO} from '../../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {IGenerateBookingInvoiceActionStrategy} from '../IGenerateBookingInvoiceActionStrategy';

export class GenerateBookingInvoiceByUpdatingGroupStrategy implements IGenerateBookingInvoiceActionStrategy {
    private _invoiceGroupMeta: InvoiceGroupMetaRepoDO;
    private _loadedInvoiceGroup: InvoiceGroupDO;
    
    constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
        private _invoiceGroupDO: InvoiceGroupDO) {
        this._invoiceGroupMeta = this.buildInvoiceGroupMetaRepoDO();
    }

    public generateBookingInvoice(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var invoiceGroupRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();

        invoiceGroupRepo.getInvoiceGroupById(this._invoiceGroupMeta, this._invoiceGroupDO.id)
            .then((loadedInvoiceGroup: InvoiceGroupDO) => {
                this._loadedInvoiceGroup = loadedInvoiceGroup;
                var itemMeta = this.buildInvoiceGroupItemMetaRepoDO();
                return invoiceGroupRepo.updateInvoiceGroup(this._invoiceGroupMeta, itemMeta, this._invoiceGroupDO);
            })
            .then((result: InvoiceGroupDO) => {
                resolve(result);
            })
            .catch((error: any) => {
               var thError = new ThError(ThStatusCode.InvoiceGroupsItemUpdateStrategyErrorUpdating, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating invoice group item", this._invoiceGroupDO, thError);
				}
				reject(thError); 
            });
    }

    private buildInvoiceGroupMetaRepoDO(): InvoiceGroupMetaRepoDO {
        return {
            hotelId: this._sessionContext.sessionDO.hotel.id
        };
    }

    private buildInvoiceGroupItemMetaRepoDO(): InvoiceGroupItemMetaRepoDO {
        return {
            id: this._loadedInvoiceGroup.id,
			versionId: this._loadedInvoiceGroup.versionId
        }
    }
}