import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {IInvoiceGroupsRepository, InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO, InvoiceGroupSearchCriteriaRepoDO, InvoiceGroupSearchResultRepoDO} from'../../IInvoiceGroupsRepository';
import {InvoiceGroupDO, InvoiceGroupStatus} from '../../../data-objects/InvoiceGroupDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';

export class MongoInvoiceGroupsReadOperationsRepository extends MongoRepository {

    constructor(invoiceGroupsEntity: Sails.Model) {
        super(invoiceGroupsEntity);

    }

    public getInvoiceGroupById(invoidGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupId: string): Promise<InvoiceGroupDO> {
        return null;
    }
    public getInvoiceGroupList(invoidGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<InvoiceGroupSearchResultRepoDO> {
        return null;
    }
    private getInvoiceGroupListCore(resolve: { (result: InvoiceGroupSearchResultRepoDO): void }, reject: { (err: ThError): void }, invoiceGroupMeta: InvoiceGroupMetaRepoDO, searchCriteria?: InvoiceGroupSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO) {

        this.findMultipleDocuments({ criteria: this.buildSearchCriteria(invoiceGroupMeta, searchCriteria), lazyLoad: lazyLoad },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.InvoiceGroupsRepositoryErrorGettingInvoiceGroupList, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting invoice group list.", invoiceGroupMeta, thError);
                reject(thError);
            },
            (dbInvoiceGroupList: Array<Object>) => {
                var resultDO = this.getQueryResultDO(dbInvoiceGroupList);
                resolve({
                    invoiceGroupList: resultDO,
                    lazyLoad: lazyLoad
                });
            }
        );
    }
    private getQueryResultDO(dbInvoiceGroupList: Array<Object>): InvoiceGroupDO[] {
        var invoiceGroupList: InvoiceGroupDO[] = [];
        dbInvoiceGroupList.forEach((dbInvoiceGroup: Object) => {
            var invoiceGroup = new InvoiceGroupDO();
            invoiceGroup.buildFromObject(dbInvoiceGroup);
            invoiceGroupList.push(invoiceGroup);
        });
        return invoiceGroupList;
    }
    private buildSearchCriteria(meta: InvoiceGroupMetaRepoDO, searchCriteria: InvoiceGroupSearchCriteriaRepoDO): Object {
        var mongoQueryBuilder = new MongoQueryBuilder();
        mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
        mongoQueryBuilder.addExactMatch("status", InvoiceGroupStatus.Active);

        if (!this._thUtils.isUndefinedOrNull(searchCriteria)) {

        }

        return mongoQueryBuilder.processedQuery;
    }
}