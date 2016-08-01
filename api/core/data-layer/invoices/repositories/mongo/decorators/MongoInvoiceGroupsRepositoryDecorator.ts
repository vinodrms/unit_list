import {MongoInvoiceGroupsRepository} from '../MongoInvoiceGroupsRepository';
import {IInvoiceGroupsRepository, InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO, InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO} from '../../IInvoiceGroupsRepository'
import {InvoiceGroupDO} from '../../../data-objects/InvoiceGroupDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';

export class MongoInvoiceGroupsRepositoryDecorator extends MongoRepository implements IInvoiceGroupsRepository {
    protected _invoiceGoupsRepo: MongoInvoiceGroupsRepository;

    constructor(invoiceGroupsRepo: MongoInvoiceGroupsRepository) {
        super(sails.models.invoicegroupsentity);
        
        this._invoiceGoupsRepo = invoiceGroupsRepo;
    }

    public getInvoiceGroupById(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupId: string): Promise<InvoiceGroupDO> {
        return this._invoiceGoupsRepo.getInvoiceGroupById(invoidGroupMeta, invoiceGroupId);
    }
    public getInvoiceGroupList(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceGroupSearchResultRepoDO> {
        return this._invoiceGoupsRepo.getInvoiceGroupList(invoidGroupMeta, searchCriteria, lazyLoad);
    }
    public getInvoiceGroupListCount(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this._invoiceGoupsRepo.getInvoiceGroupListCount(invoidGroupMeta, searchCriteria);
    }
    public addInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return this._invoiceGoupsRepo.addInvoiceGroup(invoidGroupMeta, invoiceGroup);
    }
	public updateInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return this._invoiceGoupsRepo.updateInvoiceGroup(invoidGroupMeta, invoiceGroupItemMeta, invoiceGroup);
    }
	public deleteInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO> {
        return this._invoiceGoupsRepo.deleteInvoiceGroup(invoidGroupMeta, invoiceGroupItemMeta);
    }
}