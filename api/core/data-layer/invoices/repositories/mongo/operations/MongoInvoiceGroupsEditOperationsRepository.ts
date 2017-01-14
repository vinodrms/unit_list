import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { MongoRepository, MongoErrorCodes, MongoSearchCriteria } from '../../../../common/base/MongoRepository';
import { MongoQueryBuilder } from '../../../../common/base/MongoQueryBuilder';
import { InvoiceGroupDO, InvoiceGroupStatus } from '../../../data-objects/InvoiceGroupDO';
import { InvoiceDO } from '../../../data-objects/InvoiceDO';
import { InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO } from '../../IInvoiceGroupsRepository';
import { InvoiceGroupsRepositoryHelper } from '../helpers/InvoiceGroupsRepositoryHelper';
import { MongoBookingRepository } from '../../../../bookings/repositories/mongo/MongoBookingRepository';
import { IHotelRepository, SequenceValue } from '../../../../hotel/repositories/IHotelRepository';
import { HotelSequenceType } from '../../../../hotel/data-objects/sequences/HotelSequencesDO';

import _ = require('underscore');

export class MongoInvoiceGroupsEditOperationsRepository extends MongoRepository {
    private _helper: InvoiceGroupsRepositoryHelper;

    private static InvoiceGroupReferencePrefix = 'IG';
    private static RefMaxLength = 7;

    constructor(invoiceGroupsEntity: Sails.Model, private _hotelRepo: IHotelRepository) {
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
        invoiceGroup.reindexByCustomerId();

        this.attachInvoiceGroupAndInvoiceReferencesIfNecessary(invoiceGroup).then((updatedGroup: InvoiceGroupDO) => {
            this.createDocument(updatedGroup,
                (err: Error) => {
                    this.logAndReject(err, reject, { meta: invoiceGroupMeta, invoiceGroup: invoiceGroup }, ThStatusCode.InvoiceGroupsRepositoryErrorAddingInvoiceGroup);
                },
                (createdInvoiceGroup: Object) => {
                    resolve(this._helper.buildInvoiceGroupDOFrom(createdInvoiceGroup));
                }
            );
        }).catch((e) => {
            reject(e);
        });
    }

    public updateInvoiceGroup(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroupItemMeta: InvoiceGroupItemMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        invoiceGroup.reindexByCustomerId();

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.attachInvoiceGroupAndInvoiceReferencesIfNecessary(invoiceGroup).then((updatedGroup: InvoiceGroupDO) => {
                this.findAndModifyInvoiceGroupCore(invoiceGroupMeta, invoiceGroupItemMeta, invoiceGroup, resolve, reject);
            }).catch((e) => {
                reject(e);
            });
        });
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

    private attachInvoiceGroupAndInvoiceReferencesIfNecessary(invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            return this.attachInvoiceGroupAndInvoiceReferencesIfNecessaryCore(resolve, reject, invoiceGroup);
        });
    }
    private attachInvoiceGroupAndInvoiceReferencesIfNecessaryCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }, invoiceGroup: InvoiceGroupDO) {
        var group = invoiceGroup;
        this.attachInvoiceGroupReferenceIfNecessary(group)
            .then((updatedGroup: InvoiceGroupDO) => {
                group = updatedGroup;
                var promises = [];
                _.forEach(group.invoiceList, (invoice) => {
                    promises.push(this.attachInvoiceItemReferenceIfNecessary(group.hotelId, invoice));
                });
                return Promise.all(promises);
            }).then((updatedInvoiceList: InvoiceDO[]) => {
                group.invoiceList = updatedInvoiceList;
                resolve(group);
            }).catch((e) => {
                reject(e);
            });
    }

    private attachInvoiceGroupReferenceIfNecessary(invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            if (!this._thUtils.isUndefinedOrNull(invoiceGroup.invoiceGroupReference)) {
                resolve(invoiceGroup);
                return;
            }
            this._hotelRepo.getNextSequenceValue(invoiceGroup.hotelId, HotelSequenceType.InvoiceGroup)
                .then((seq: SequenceValue) => {
                    invoiceGroup.invoiceGroupReference = MongoInvoiceGroupsEditOperationsRepository.InvoiceGroupReferencePrefix + this.getSequenceString(seq.sequence);
                    resolve(invoiceGroup);
                }).catch((e) => {
                    reject(e);
                });
        });
    }

    private attachInvoiceItemReferenceIfNecessary(hotelId: string, invoice: InvoiceDO): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            if (!this._thUtils.isUndefinedOrNull(invoice.invoiceReference)) {
                resolve(invoice);
                return;
            }
            this._hotelRepo.getNextSequenceValue(hotelId, HotelSequenceType.InvoiceItem)
                .then((seq: SequenceValue) => {
                    invoice.invoiceReference = seq.hotelPrefix + this.getSequenceString(seq.sequence);
                    resolve(invoice);
                }).catch((e) => {
                    reject(e);
                });
        });
    }

    private getSequenceString(seq: number): string {
        var seqStr: string = seq + "";
        while (seqStr.length < MongoInvoiceGroupsEditOperationsRepository.RefMaxLength) {
            seqStr = "0" + seqStr;
        }
        return seqStr;
    }

    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var errorCode = this.getMongoErrorCode(err);
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding invoice group", context, thError);
        reject(thError);
    }
}