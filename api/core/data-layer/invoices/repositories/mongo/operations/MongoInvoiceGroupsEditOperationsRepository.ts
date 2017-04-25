import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { MongoRepository, MongoErrorCodes, MongoSearchCriteria } from '../../../../common/base/MongoRepository';
import { MongoQueryBuilder } from '../../../../common/base/MongoQueryBuilder';
import { InvoiceGroupDO, InvoiceGroupStatus } from '../../../data-objects/InvoiceGroupDO';
import { InvoiceDO, InvoicePaymentStatus } from '../../../data-objects/InvoiceDO';
import { InvoiceGroupMetaRepoDO, InvoiceGroupItemMetaRepoDO } from '../../IInvoiceGroupsRepository';
import { InvoiceGroupsRepositoryHelper } from '../helpers/InvoiceGroupsRepositoryHelper';
import { MongoInvoiceGroupsReadOperationsRepository } from './MongoInvoiceGroupsReadOperationsRepository';
import { MongoBookingRepository } from '../../../../bookings/repositories/mongo/MongoBookingRepository';
import { IHotelRepository, SequenceValue } from '../../../../hotel/repositories/IHotelRepository';
import { HotelSequenceType } from '../../../../hotel/data-objects/sequences/HotelSequencesDO';

import _ = require('underscore');

export class MongoInvoiceGroupsEditOperationsRepository extends MongoRepository {
    private _helper: InvoiceGroupsRepositoryHelper;

    private static InvoiceGroupReferencePrefix = 'IG';
    private static TemporaryInvoiceReferencePrefix = 'TEMP';
    private static RefMaxLength = 7;

    constructor(invoiceGroupsEntity: Sails.Model, private _hotelRepo: IHotelRepository,
        private _invoiceReadRepository: MongoInvoiceGroupsReadOperationsRepository) {
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
        invoiceGroup.attachIdsToInvoicesIfNecessary();

        this.attachReferencesToInvoiceGroupAndInvoiceItemsIfNecessary(invoiceGroupMeta, invoiceGroup)
            .then((updatedGroup: InvoiceGroupDO) => {
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
        invoiceGroup.attachIdsToInvoicesIfNecessary();

        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            this.attachReferencesToInvoiceGroupAndInvoiceItemsIfNecessary(invoiceGroupMeta, invoiceGroup)
                .then((updatedGroup: InvoiceGroupDO) => {
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

    private attachReferencesToInvoiceGroupAndInvoiceItemsIfNecessary(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<InvoiceGroupDO> {
        return new Promise<InvoiceGroupDO>((resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void }) => {
            return this.attachInvoiceGroupAndInvoiceReferencesIfNecessaryCore(resolve, reject, invoiceGroupMeta, invoiceGroup);
        });
    }
    private attachInvoiceGroupAndInvoiceReferencesIfNecessaryCore(resolve: { (result: InvoiceGroupDO): void }, reject: { (err: ThError): void },
        invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO) {

        var group = invoiceGroup;
        var paymentStatusByInvoiceReferenceMap: { [index: string]: InvoicePaymentStatus };
        this.getCurrentPaymentStatusByInvoiceIdMap(invoiceGroupMeta, invoiceGroup)
            .then((map: { [index: string]: InvoicePaymentStatus }) => {
                paymentStatusByInvoiceReferenceMap = map;
                return this.attachInvoiceGroupReferenceIfNecessary(group);
            }).then((updatedGroup: InvoiceGroupDO) => {
                group = updatedGroup;
                var promiseList = [];
                group.invoiceList.forEach((invoice) => {
                    let promise = this.attachInvoiceItemReferenceIfNecessary(group.hotelId, invoice, paymentStatusByInvoiceReferenceMap);
                    promiseList.push(promise);
                });
                return Promise.all(promiseList);
            }).then((updatedInvoiceList: InvoiceDO[]) => {
                group.invoiceList = updatedInvoiceList;
                resolve(group);
            }).catch((e) => {
                reject(e);
            });
    }

    private getCurrentPaymentStatusByInvoiceIdMap(invoiceGroupMeta: InvoiceGroupMetaRepoDO, invoiceGroup: InvoiceGroupDO): Promise<{ [index: string]: InvoicePaymentStatus }> {
        return new Promise<{ [index: string]: InvoicePaymentStatus }>((resolve: { (result: { [index: string]: InvoicePaymentStatus }): void }, reject: { (err: ThError): void }) => {
            // if the invoice group is not created return an empty result
            if (this._thUtils.isUndefinedOrNull(invoiceGroup.id)) {
                resolve({});
                return;
            }
            this._invoiceReadRepository.getInvoiceGroupById(invoiceGroupMeta, invoiceGroup.id)
                .then((readInvoiceGroup: InvoiceGroupDO) => {
                    let paymentStatusByInvoiceIdMap: { [index: string]: InvoicePaymentStatus } = {};
                    _.forEach(readInvoiceGroup.invoiceList, (readInvoice: InvoiceDO) => {
                        paymentStatusByInvoiceIdMap[readInvoice.id] = readInvoice.paymentStatus;
                    });
                    resolve(paymentStatusByInvoiceIdMap);
                }).catch(e => { reject(e); });
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

    private attachInvoiceItemReferenceIfNecessary(hotelId: string, invoice: InvoiceDO,
        paymentStatusByInvoiceIdMap: { [index: string]: InvoicePaymentStatus }): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            let oldPaymentStatus: InvoicePaymentStatus;
            if (!this._thUtils.isUndefinedOrNull(invoice.id)) {
                oldPaymentStatus = paymentStatusByInvoiceIdMap[invoice.id];
            }
            // only attach the invoice reference from the Invoice Sequence if it was marked as Paid and it was not Paid previously
            if (oldPaymentStatus !== invoice.paymentStatus
                && invoice.paymentStatus === InvoicePaymentStatus.Paid
                && this.isTemporaryInvoiceReference(invoice.invoiceReference)) {
                this._hotelRepo.getNextSequenceValue(hotelId, HotelSequenceType.InvoiceItem)
                    .then((seq: SequenceValue) => {
                        invoice.invoiceReference = seq.hotelPrefix + this.getSequenceString(seq.sequence);
                        resolve(invoice);
                    }).catch((e) => {
                        reject(e);
                    });
            }
            else {
                // attach a different reference for open invoices
                if (this._thUtils.isUndefinedOrNull(invoice.invoiceReference)) {
                    invoice.invoiceReference = this.getTemporaryInvoiceReference();
                }
                resolve(invoice);
            }
        });
    }

    private getSequenceString(seq: number): string {
        var seqStr: string = seq + "";
        while (seqStr.length < MongoInvoiceGroupsEditOperationsRepository.RefMaxLength) {
            seqStr = "0" + seqStr;
        }
        return seqStr;
    }
    private getTemporaryInvoiceReference(): string {
        return MongoInvoiceGroupsEditOperationsRepository.TemporaryInvoiceReferencePrefix + this._thUtils.generateShortId();
    }
    private isTemporaryInvoiceReference(invoiceReference: string): boolean {
        let tempPrefix = MongoInvoiceGroupsEditOperationsRepository.TemporaryInvoiceReferencePrefix;
        if (_.isString(invoiceReference) && invoiceReference.length > tempPrefix.length) {
            return invoiceReference.substr(0, tempPrefix.length) === tempPrefix;
        }
        return false;
    }

    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var errorCode = this.getMongoErrorCode(err);
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding invoice group", context, thError);
        reject(thError);
    }
}