import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../common/base/MongoRepository';
import {IInvoiceGroupsRepository, InvoiceGroupItemMetaRepoDO} from'../IInvoiceGroupsRepository';
import {InvoiceGroupDO} from '../../data-objects/InvoiceGroupDO';
import {MongoInvoiceGroupsReadOperationsRepository} from './operations/MongoInvoiceGroupsReadOperationsRepository';
import {MongoInvoiceGroupsEditOperationsRepository} from './operations/MongoInvoiceGroupsEditOperationsRepository';

export class MongoInvoiceGroupsRepository extends MongoRepository implements IInvoiceGroupsRepository {
    private _readRepository: MongoInvoiceGroupsReadOperationsRepository;
    private _editRepository: MongoInvoiceGroupsEditOperationsRepository;

    constructor() {
        var invoiceGroupsEntity = sails.model.invoicegroupsentity;
        super(invoiceGroupsEntity);

        this._readRepository = new MongoInvoiceGroupsReadOperationsRepository(invoiceGroupsEntity);
        this._editRepository = new MongoInvoiceGroupsEditOperationsRepository(invoiceGroupsEntity);
    }

    public addInvoiceGroup(invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return this._editRepository.addInvoiceGroup(invoiceGroup);
    }
	public updateInvoiceGroup(invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return this._editRepository.addInvoiceGroup(invoiceGroup);
    }
	public deleteInvoiceGroup(invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO> {
        return this._editRepository.deleteInvoiceGroup(invoiceGroupItemMeta);
    }
}