import {MongoInvoiceGroupsRepository} from '../MongoInvoiceGroupsRepository';
import {IInvoiceGroupsRepository, InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO, InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO, InvoiceSearchCriteriaRepoDO} from '../../IInvoiceGroupsRepository'
import {InvoiceGroupDO} from '../../../data-objects/InvoiceGroupDO';
import {InvoiceDO} from '../../../data-objects/InvoiceDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';

export class MongoInvoiceGroupsRepositoryDecorator extends MongoRepository implements IInvoiceGroupsRepository {
    protected _invoiceGroupsRepo: MongoInvoiceGroupsRepository;

    constructor(invoiceGroupsRepo: MongoInvoiceGroupsRepository) {
        super(sails.models.invoicegroupsentity);
        
        this._invoiceGroupsRepo = invoiceGroupsRepo;
    }

    public getInvoiceGroupById(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupId: string): Promise<InvoiceGroupDO> {
        return this._invoiceGroupsRepo.getInvoiceGroupById(invoidGroupMeta, invoiceGroupId);
    }
    public getInvoiceGroupList(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceGroupSearchResultRepoDO> {
        return this._invoiceGroupsRepo.getInvoiceGroupList(invoidGroupMeta, searchCriteria, lazyLoad);
    }
    public getInvoiceGroupListCount(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this._invoiceGroupsRepo.getInvoiceGroupListCount(invoidGroupMeta, searchCriteria);
    }
    public addInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return this._invoiceGroupsRepo.addInvoiceGroup(invoidGroupMeta, invoiceGroup);
    }
	public updateInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return this._invoiceGroupsRepo.updateInvoiceGroup(invoidGroupMeta, invoiceGroupItemMeta, invoiceGroup);
    }
	public deleteInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO> {
        return this._invoiceGroupsRepo.deleteInvoiceGroup(invoidGroupMeta, invoiceGroupItemMeta);
    }
}