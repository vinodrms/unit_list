import { ThError } from '../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from './ATransactionalMongoPatch';
import { MongoPatchType } from '../patches/MongoPatchType';
import { MongoUpdateMultipleDocuments } from '../../../../../data-layer/common/base/mongo-utils/MongoUpdateMultipleDocuments';
import { MongoSearchCriteria, MongoRepository } from '../../../../../data-layer/common/base/MongoRepository';

import async = require("async");

/**
 * Extend this class only when the multi update cannot be made without in memory updates (find + update + findAndModify)
 * The class reads in chunks of `PageSize` documents from the collection, updates them in memory, and saves them back to the database
 */
export abstract class APaginatedTransactionalMongoPatch extends ATransactionalMongoPatch {
    public static PageSize = 50;

    private _repository: MongoRepository;

    constructor() {
        super();
        this._repository = this.getMongoRepository();
    }
    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        var noUpdated = 0, noToUpdate = 0, pageNumber = 0;
        var noUpdatedInCurrentStep = 0;
        async.doWhilst((finishSingleUpdateCallback) => {
            let searchCriteria: MongoSearchCriteria = {
                criteria: {},
                lazyLoad: {
                    pageNumber: pageNumber,
                    pageSize: APaginatedTransactionalMongoPatch.PageSize
                },
                sortCriteria: { "_id": 1 }
            };
            this._repository.findMultipleDocuments(searchCriteria, (err) => {
                finishSingleUpdateCallback(err);
            }, (documentList: any[]) => {
                noToUpdate += documentList.length;

                let documentUpdatePromiseList: Promise<any>[] = [];
                documentList.forEach(document => {
                    documentUpdatePromiseList.push(this.updateDocumentInMemoryAsync(document));
                });
                Promise.all(documentUpdatePromiseList)
                    .then((updatedDocumentList: any[]) => {
                        var promiseList = [];
                        updatedDocumentList.forEach(document => {
                            promiseList.push(this.updateDocumentInDatabase(document));
                        });
                        return Promise.all(promiseList);
                    }).then(result => {
                        noUpdated += result.length;
                        noUpdatedInCurrentStep = result.length;
                        pageNumber++;
                        finishSingleUpdateCallback(null);
                    }).catch(err => {
                        finishSingleUpdateCallback(err);
                    });
            });
        }, () => {
            return noUpdatedInCurrentStep > 0;
        }, (err: any) => {
            if (err) {
                reject(err);
            }
            else if (noUpdated != noToUpdate) {
                let error = new Error("Patch " + this.getPatchType() + " did not update all the rows.")
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    }
    private updateDocumentInDatabase(document): Promise<boolean> {
        return new Promise<boolean>((resolve: { (result: boolean): void }, reject: { (err: any): void }) => {
            this._repository.findAndModifyDocument({
                id: document.id
            }, document,
                () => {
                    reject(new Error("document not found"));
                },
                (err: Error) => {
                    reject(err);
                },
                (updatedDBDocument: Object) => {
                    resolve(true);
                }
            );
        });
    }

    private updateDocumentInMemoryAsync(document): Promise<any> {
        return new Promise<any>((resolve: { (result: any): void }, reject: { (err: ThError): void }) => {
            this.updateDocumentInMemoryAsyncCore(resolve, reject, document);
        });
    }

    /**
     * override this function when the update needs to be done async (e.g. it requires additional promises etc)
     */
    protected updateDocumentInMemoryAsyncCore(resolve: { (result: any): void }, reject: { (err: ThError): void }, document) {
        try {
            this.updateDocumentInMemory(document);
            resolve(document);
        } catch (e) {
            reject(e);
        }
    }

    /**
     * Return the repository that will be paginated
     */
    protected abstract getMongoRepository(): MongoRepository;

    /**
     * 
     * @param document A single document from the collection
     * The function needs to make the according update on the document
     */
    protected abstract updateDocumentInMemory(document);
}