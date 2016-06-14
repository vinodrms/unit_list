import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {InvoiceGroupDO, InvoiceGroupStatus} from '../../../data-objects/InvoiceGroupDO';
import {InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO} from'../../IInvoiceGroupsRepository';
import {InvoiceGroupsRepositoryHelper} from '../helpers/InvoiceGroupsRepositoryHelper';

export class MongoInvoiceGroupsEditOperationsRepository extends MongoRepository {
    private _helper: InvoiceGroupsRepositoryHelper;

    constructor(invoiceGroupsEntity: Sails.Model) {
        super(invoiceGroupsEntity);
        this._helper = new InvoiceGroupsRepositoryHelper();
    }

    public addInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.addInvoiceGroupCore(resolve, reject, invoiceGroupMeta, invoiceGroup);
        });
    }
    public addInvoiceGroupCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }, invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO) {
        invoiceGroup.hotelId = invoiceGroupMeta.hotelId;
        invoiceGroup.versionId = 0;
        invoiceGroup.status = InvoiceGroupStatus.Active;

        this.createDocument(invoiceGroup,
            (err: Error) => {
                this.logAndReject(err, reject, { meta: invoiceGroupMeta, invoiceGroup: invoiceGroup }, ThStatusCode.InvoiceGroupsRepositoryErrorAddingInvoiceGroup);
            },
            (createdInvoiceGroup: Object) => {
                resolve(this._helper.buildInvoiceGroupDOFrom(createdInvoiceGroup));
            }
        );
    }

    public updateInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return this.findAndModifyInvoiceGroup(invoiceGroupMeta, invoiceGroupItemMeta, invoiceGroup);
    }
    public deleteInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO): Promise<InvoiceGroupDO> {
        return this.findAndModifyInvoiceGroup(invoiceGroupMeta, invoiceGroupItemMeta,
            {
                "status": InvoiceGroupStatus.Deleted
            });
    }

    private findAndModifyInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, updateQuery: Object): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.findAndModifyInvoiceGroupCore(invoiceGroupMeta, invoiceGroupItemMeta, updateQuery, resolve, reject);
        });
    }
    private findAndModifyInvoiceGroupCore(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, updateQuery: any, resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) {
        updateQuery.$inc = { "versionId": 1 };
        delete updateQuery.versionId;
        var findQuery: Object = {
            "hotelId": invoiceGroupMeta.hotelId,
            "id": invoiceGroupItemMeta.id,
            "versionId": invoiceGroupItemMeta.versionId
        };
        this.findAndModifyDocument(findQuery, updateQuery,
            () => {
                var thError = new ThError(ThStatusCode.InvoiceGroupsRepositoryProblemUpdatingInvoiceGroup, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating invoice group - concurrency", { invoiceGroupItemMeta: invoiceGroupItemMeta, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (err: Error) => {
                this.logAndReject(err, reject, { invoiceGroupItemMeta: invoiceGroupItemMeta, updateQuery: updateQuery }, ThStatusCode.InvoiceGroupsRepositoryErrorUpdatingInvoiceGroup);
            },
            (updatedDBInvoiceGroup: Object) => {
                var invoiceGroup: InvoiceGroupDO = new InvoiceGroupDO();
                invoiceGroup.buildFromObject(updatedDBInvoiceGroup);
                resolve(invoiceGroup);
            }
        );
    }

    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var errorCode = this.getMongoErrorCode(err);
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding invoice group", context, thError);
        reject(thError);
    }
}