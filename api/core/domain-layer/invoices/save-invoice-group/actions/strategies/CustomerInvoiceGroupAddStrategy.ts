import {AppContext} from '../../../../../utils/AppContext';
import {SessionContext} from '../../../../../utils/SessionContext';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';

import {InvoiceGroupDO} from '../../../../../data-layer/invoices/data-objects/InvoiceGroupDO';
import {ISaveInvoiceGroupActionStrategy} from '../ISaveInvoiceGroupActionStrategy';
import {InvoiceGroupMetaRepoDO} from '../../../../../data-layer/invoices/repositories/IInvoiceGroupsRepository';

import {TaxResponseRepoDO} from '../../../../../data-layer/taxes/repositories/ITaxRepository';
import {TaxDO} from '../../../../../data-layer/taxes/data-objects/TaxDO';

export class CustomerInvoiceGroupAddStrategy implements ISaveInvoiceGroupActionStrategy {
    private _thUtils: ThUtils;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext,
        private _invoiceGroupDO: InvoiceGroupDO) {
        this._thUtils = new ThUtils();
    }

    public saveInvoiceGroup(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        var invoiceGroupRepo = this._appContext.getRepositoryFactory().getInvoiceGroupsRepository();
        this._appContext.getRepositoryFactory().getTaxRepository().getTaxList({ hotelId: this.hotelId }).then((result: TaxResponseRepoDO) => {
            this._invoiceGroupDO.vatTaxListSnapshot = result.vatList;

            return invoiceGroupRepo.addInvoiceGroup({ hotelId: this.hotelId }, this._invoiceGroupDO);
        }).then((result: InvoiceGroupDO) => {
            resolve(result);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.CustomerInvoiceGroupAddStrategyErrorAdding, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error adding customer invoice group", this._invoiceGroupDO, thError);
            }
            reject(thError);
        });
    }

    private get hotelId(): string {
        return this._sessionContext.sessionDO.hotel.id;
    }
}