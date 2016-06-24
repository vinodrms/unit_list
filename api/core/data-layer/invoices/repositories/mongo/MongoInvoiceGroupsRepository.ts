import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../common/base/MongoRepository';
import {IInvoiceGroupsRepository, InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO, InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO} from'../IInvoiceGroupsRepository';
import {InvoiceGroupDO} from '../../data-objects/InvoiceGroupDO';
import {MongoInvoiceGroupsReadOperationsRepository} from './operations/MongoInvoiceGroupsReadOperationsRepository';
import {MongoInvoiceGroupsEditOperationsRepository} from './operations/MongoInvoiceGroupsEditOperationsRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';

export class MongoInvoiceGroupsRepository extends MongoRepository implements IInvoiceGroupsRepository {
    private _readRepository: MongoInvoiceGroupsReadOperationsRepository;
    private _editRepository: MongoInvoiceGroupsEditOperationsRepository;

    constructor() {
        var invoiceGroupsEntity = sails.model.invoicegroupsentity;
        super(invoiceGroupsEntity);

        this._readRepository = new MongoInvoiceGroupsReadOperationsRepository(invoiceGroupsEntity);
        this._editRepository = new MongoInvoiceGroupsEditOperationsRepository(invoiceGroupsEntity);
    }

    public getInvoiceGroupById(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupId: string): Promise<InvoiceGroupDO> {
        return this._readRepository.getInvoiceGroupById(invoidGroupMeta, invoiceGroupId);
    }
    public getInvoiceGroupList(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceGroupSearchResultRepoDO> {
        return this._readRepository.getInvoiceGroupList(invoidGroupMeta, searchCriteria, lazyLoad);
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