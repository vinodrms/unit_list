import { ThLogger, ThLogLevel } from '../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../utils/th-responses/ThResponse';
import { MongoRepository, MongoErrorCodes, MongoSearchCriteria } from '../../../../common/base/MongoRepository';
import { MongoQueryBuilder } from '../../../../common/base/MongoQueryBuilder';
import { InvoiceDO, InvoicePaymentStatus, InvoiceStatus } from '../../../data-objects/InvoiceDO';
import { IHotelRepository, SequenceValue } from '../../../../hotel/repositories/IHotelRepository';
import { HotelSequenceType } from '../../../../hotel/data-objects/sequences/HotelSequencesDO';
import { ThTimestampDO } from "../../../../../utils/th-dates/data-objects/ThTimestampDO";
import { HotelDO } from "../../../../hotel/data-objects/HotelDO";
import { ThDateUtils } from "../../../../../utils/th-dates/ThDateUtils";
import { MongoInvoiceReadOperationsRepository } from "./MongoInvoiceReadOperationsRepository";
import { InvoiceMetaRepoDO, InvoiceItemMetaRepoDO } from "../../IInvoiceRepository";

import _ = require('underscore');

export class MongoInvoiceEditOperationsRepository extends MongoRepository {
    private static InvoiceGroupReferencePrefix = 'IG';
    private static TemporaryInvoiceReferencePrefix = 'TEMP';
    private static RefMinLength = 7;

    constructor(invoiceGroupsEntity: any, private hotelRepo: IHotelRepository,
        private invoiceReadRepository: MongoInvoiceReadOperationsRepository) {
        super(invoiceGroupsEntity);
    }

    addInvoice(invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.addInvoiceCore(resolve, reject, invoiceMeta, invoice);
        });
    }
    public addInvoiceCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }, invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO) {
        invoice.hotelId = invoiceMeta.hotelId;
        invoice.versionId = 0;
        invoice.status = InvoiceStatus.Active;
        invoice.reindex();

        this.attachInvoiceReferenceIfNecessary(invoiceMeta, invoice)
            .then((updatedInvoice: InvoiceDO) => {
                this.createDocument(updatedInvoice,
                    (err: Error) => {
                        this.logAndReject(err, reject, { meta: invoiceMeta, invoice: invoice }, ThStatusCode.InvoiceRepositoryErrorAddingInvoice);
                    },
                    (createdInvoice: Object) => {
                        var invoice = new InvoiceDO();
                        invoice.buildFromObject(createdInvoice);
                        resolve(invoice);
                    }
                );
            }).catch((e) => {
                reject(e);
            });
    }

    public updateInvoice(invoiceMeta: InvoiceMetaRepoDO, invoiceItemMeta: InvoiceItemMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        invoice.reindex();

        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.attachInvoiceReferenceIfNecessary(invoiceMeta, invoice)
                .then((updatedInvoice: InvoiceDO) => {
                    return this.findAndModifyInvoice(invoiceMeta, invoiceItemMeta, invoice);
                }).then((updatedInvoice: InvoiceDO) => {
                    resolve(updatedInvoice)
                }).catch((e) => {
                    reject(e);
                });
        });
    }

    private findAndModifyInvoice(invoiceMeta: InvoiceMetaRepoDO, invoiceItemMeta: InvoiceItemMetaRepoDO, updateQuery: Object): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            this.findAndModifyInvoiceCore(invoiceMeta, invoiceItemMeta, updateQuery, resolve, reject);
        });
    }
    private findAndModifyInvoiceCore(invoiceMeta: InvoiceMetaRepoDO, invoiceItemMeta: InvoiceItemMetaRepoDO, updateQuery: any, resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) {
        updateQuery.$inc = { "versionId": 1 };
        delete updateQuery.versionId;
        var findQuery: Object = {
            "hotelId": invoiceMeta.hotelId,
            "id": invoiceItemMeta.id,
            "versionId": invoiceItemMeta.versionId
        };
        this.findAndModifyDocument(findQuery, updateQuery,
            () => {
                var thError = new ThError(ThStatusCode.InvoiceRepositoryProblemUpdatingInvoice, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating invoice - concurrency", { invoiceItemMeta: invoiceItemMeta, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (err: Error) => {
                this.logAndReject(err, reject, { invoiceItemMeta: invoiceItemMeta, updateQuery: updateQuery }, ThStatusCode.InvoiceRepositoryErrorUpdatingInvoice);
            },
            (updatedDBInvoice: Object) => {
                var invoice: InvoiceDO = new InvoiceDO();
                invoice.buildFromObject(updatedDBInvoice);
                resolve(invoice);
            }
        );
    }

    private attachInvoiceReferenceIfNecessary(invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            return this.attachInvoiceReferenceIfNecessaryCore(resolve, reject, invoiceMeta, invoice);
        });
    }
    private attachInvoiceReferenceIfNecessaryCore(resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }, invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO) {
        var paymentStatusByInvoiceReferenceMap: { [index: string]: InvoicePaymentStatus };

        this.getCurrentPaymentStatusByInvoiceIdMap(invoiceMeta, invoice)
            .then((map: { [index: string]: InvoicePaymentStatus }) => {
                paymentStatusByInvoiceReferenceMap = map;

                return this.hotelRepo.getHotelById(invoiceMeta.hotelId);
            }).then((hotel: HotelDO) => {
                let timezone: string = hotel.timezone;
                let paymentDueInDays: number = hotel.paymentDueInDays;

                return this.attachInvoiceItemReferenceIfNecessary(invoiceMeta.hotelId, invoice, timezone, paymentDueInDays, paymentStatusByInvoiceReferenceMap);
            }).then((updatedInvoice: InvoiceDO) => {
                resolve(updatedInvoice);
            }).catch((e) => {
                reject(e);
            });
    }

    private getCurrentPaymentStatusByInvoiceIdMap(invoiceMeta: InvoiceMetaRepoDO, invoice: InvoiceDO): Promise<{ [index: string]: InvoicePaymentStatus }> {
        return new Promise<{ [index: string]: InvoicePaymentStatus }>((resolve: { (result: { [index: string]: InvoicePaymentStatus }): void }, reject: { (err: ThError): void }) => {
            // if the invoice is not created return an empty result
            if (this._thUtils.isUndefinedOrNull(invoice.id)) {
                resolve({});
                return;
            }
            this.invoiceReadRepository.getInvoiceById(invoiceMeta, invoice.id)
                .then((readInvoice: InvoiceDO) => {
                    let paymentStatusByInvoiceIdMap: { [index: string]: InvoicePaymentStatus } = {};
                    paymentStatusByInvoiceIdMap[readInvoice.id] = readInvoice.paymentStatus;
                    resolve(paymentStatusByInvoiceIdMap);
                }).catch(e => { reject(e); });
        });
    }

    private attachInvoiceItemReferenceIfNecessary(hotelId: string, invoice: InvoiceDO, timezone: string, paymentDueInDays: number,
        paymentStatusByInvoiceIdMap: { [index: string]: InvoicePaymentStatus }): Promise<InvoiceDO> {
        return new Promise<InvoiceDO>((resolve: { (result: InvoiceDO): void }, reject: { (err: ThError): void }) => {
            let oldPaymentStatus: InvoicePaymentStatus;
            if (!this._thUtils.isUndefinedOrNull(invoice.id)) {
                oldPaymentStatus = paymentStatusByInvoiceIdMap[invoice.id];
            }
            this.ensureDueDateIsSet(invoice, timezone, paymentDueInDays);

            // only attach the invoice reference from the Invoice Sequence if it was marked as Paid and it was not Paid previously
            if (oldPaymentStatus !== invoice.paymentStatus
                && invoice.paymentStatus === InvoicePaymentStatus.Paid
                && this.isTemporaryInvoiceReference(invoice.reference)) {
                this.hotelRepo.getNextSequenceValue(hotelId, HotelSequenceType.InvoiceItem)
                    .then((seq: SequenceValue) => {
                        invoice.reference = seq.hotelPrefix + this.getSequenceString(seq.sequence);
                        this.setPaidTimestampOnInvoice(invoice);
                        resolve(invoice);
                    }).catch((e) => {
                        reject(e);
                    });
            }
            //attach paid dates if it's a new invoice and paymentStatus=PAID
            else if ((invoice.paymentStatus === InvoicePaymentStatus.Paid)
                && _.isUndefined(oldPaymentStatus)) {
                this.setPaidTimestampOnInvoice(invoice);
                resolve(invoice);
            }
            else {
                // attach a different reference for open invoices
                if (this._thUtils.isUndefinedOrNull(invoice.reference)) {
                    invoice.reference = this.getTemporaryInvoiceReference();
                }

                // attach the paid date for reporting if it has been marked as loss by management
                if (oldPaymentStatus !== invoice.paymentStatus
                    && invoice.paymentStatus === InvoicePaymentStatus.LossAcceptedByManagement) {
                    this.setPaidTimestampOnInvoice(invoice);
                }

                resolve(invoice);
            }
        });
    }
    private ensureDueDateIsSet(invoice: InvoiceDO, timezone: string, paymentDueInDays: number) {
        if (this._thUtils.isUndefinedOrNull(invoice.paymentDueDate)) {
            var thTimestamp = ThTimestampDO.buildThTimestampForTimezone(timezone);
            invoice.paymentDueDate = new ThDateUtils().addDaysToThDateDO(thTimestamp.thDateDO, paymentDueInDays);
        }
    }
    private setPaidTimestampOnInvoice(invoice: InvoiceDO) {
        if (!_.isNumber(invoice.paidTimestamp)) {
            invoice.paidTimestamp = (new Date()).getTime();
        }
    }

    private getSequenceString(seq: number): string {
        var seqStr: string = seq + "";
        while (seqStr.length < MongoInvoiceEditOperationsRepository.RefMinLength) {
            seqStr = "0" + seqStr;
        }
        return seqStr;
    }
    private getTemporaryInvoiceReference(): string {
        return MongoInvoiceEditOperationsRepository.TemporaryInvoiceReferencePrefix + this._thUtils.generateShortId();
    }
    private isTemporaryInvoiceReference(invoiceReference: string): boolean {
        let tempPrefix = MongoInvoiceEditOperationsRepository.TemporaryInvoiceReferencePrefix;
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
