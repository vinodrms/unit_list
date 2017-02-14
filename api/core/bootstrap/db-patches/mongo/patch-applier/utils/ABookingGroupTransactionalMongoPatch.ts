import { ThError } from '../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from './ATransactionalMongoPatch';
import { MongoPatchType } from '../patches/MongoPatchType';
import { MongoUpdateMultipleDocuments } from '../../../../../data-layer/common/base/mongo-utils/MongoUpdateMultipleDocuments';
import { PriceProductPriceType } from '../../../../../data-layer/price-products/data-objects/price/IPriceProductPrice';
import { MongoSearchCriteria } from '../../../../../data-layer/common/base/MongoRepository';

import async = require("async");

// extend this class only when the multi update cannot be made without in memory updates (find + update + findAndModify)
export abstract class ABookingGroupTransactionalMongoPatch extends ATransactionalMongoPatch {
    public static PageSize = 20;

    public abstract getPatchType(): MongoPatchType;

    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        var noUpdated = 0, pageNumber = 0;
        async.doWhilst((finishSingleUpdateCallback) => {
            let searchCriteria: MongoSearchCriteria = {
                criteria: {},
                lazyLoad: {
                    pageNumber: pageNumber,
                    pageSize: ABookingGroupTransactionalMongoPatch.PageSize
                }
            };
            this._bookingRepository.findMultipleDocuments(searchCriteria, (err) => {
                finishSingleUpdateCallback(err);
            }, (bookingGroups: any[]) => {
                bookingGroups.forEach(group => {
                    this.updateBookingGroupInMemory(group);
                });
                var promiseList = [];
                bookingGroups.forEach(group => {
                    promiseList.push(this.updateBookingGroupInDatabase(group));
                });
                Promise.all(promiseList).then(result => {
                    noUpdated = result.length;
                    pageNumber++;
                    finishSingleUpdateCallback(null);
                }).catch(err => {
                    finishSingleUpdateCallback(err);
                });
            });
        }, () => {
            return noUpdated > 0;
        }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    }
    private updateBookingGroupInDatabase(bookingGroup): Promise<boolean> {
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: any): void }) => {
            this._bookingRepository.findAndModifyDocument({
                id: bookingGroup.id
            }, bookingGroup,
                () => {
                    reject(new Error("booking not found"));
                },
                (err: Error) => {
                    reject(err);
                },
                (updatedDBInvoiceGroup: Object) => {
                    resolve(true);
                }
            );
        });
    }
    protected abstract updateBookingGroupInMemory(bookingGroup);
}