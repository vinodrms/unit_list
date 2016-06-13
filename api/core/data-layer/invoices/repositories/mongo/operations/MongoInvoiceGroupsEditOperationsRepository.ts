import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {InvoiceGroupDO} from '../../../data-objects/InvoiceGroupDO';
import {InvoiceGroupItemMetaRepoDO} from'../../IInvoiceGroupsRepository';

export class MongoInvoiceGroupsEditOperationsRepository extends MongoRepository {
    
    constructor(invoiceGroupsEntity: Sails.Model) {
        super(invoiceGroupsEntity);
    }

    public addInvoiceGroup(invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return null;
    }
    public updateInvoiceGroup(invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return null;    
    }
    public deleteInvoiceGroup(invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO> {
        return null;
    }
}