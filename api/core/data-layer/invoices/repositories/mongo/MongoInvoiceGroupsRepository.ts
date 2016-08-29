import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../common/base/MongoRepository';
import {IInvoiceGroupsRepository, InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO, InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO, InvoiceSearchCriteriaRepoDO} from'../IInvoiceGroupsRepository';
import {InvoiceGroupDO} from '../../data-objects/InvoiceGroupDO';
import {InvoiceDO} from '../../data-objects/InvoiceDO';
import {MongoInvoiceGroupsReadOperationsRepository} from './operations/MongoInvoiceGroupsReadOperationsRepository';
import {MongoInvoiceGroupsEditOperationsRepository} from './operations/MongoInvoiceGroupsEditOperationsRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {MongoBookingRepository} from '../../../bookings/repositories/mongo/MongoBookingRepository';

export class MongoInvoiceGroupsRepository extends MongoRepository implements IInvoiceGroupsRepository {
    private _readRepository: MongoInvoiceGroupsReadOperationsRepository;
    private _editRepository: MongoInvoiceGroupsEditOperationsRepository;

    constructor() {
        super(sails.models.invoicegroupsentity);

        this._readRepository = new MongoInvoiceGroupsReadOperationsRepository(sails.models.invoicegroupsentity);
        this._editRepository = new MongoInvoiceGroupsEditOperationsRepository(sails.models.invoicegroupsentity);
    }

    public getInvoiceGroupById(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupId: string): Promise<InvoiceGroupDO> {
        return this._readRepository.getInvoiceGroupById(invoidGroupMeta, invoiceGroupId);
    }
    public getInvoiceGroupList(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceGroupSearchResultRepoDO> {
        return this._readRepository.getInvoiceGroupList(invoidGroupMeta, searchCriteria, lazyLoad);
    }
    public getInvoiceGroupListCount(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this._readRepository.getInvoiceGroupListCount(invoidGroupMeta, searchCriteria);
    }
    public addInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return this._editRepository.addInvoiceGroup(invoidGroupMeta, invoiceGroup);
    }
	public updateInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return this._editRepository.updateInvoiceGroup(invoidGroupMeta, invoiceGroupItemMeta, invoiceGroup);
    }
	public deleteInvoiceGroup(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO> {
        return this._editRepository.deleteInvoiceGroup(invoidGroupMeta, invoiceGroupItemMeta);
    }
}