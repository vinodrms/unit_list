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
        var noUpdated = 0, pageNumber = 0;
        async.doWhilst((finishSingleUpdateCallback) => {
            let searchCriteria: MongoSearchCriteria = {
                criteria: {},
                lazyLoad: {
                    pageNumber: pageNumber,
                    pageSize: APaginatedTransactionalMongoPatch.PageSize
                }
            };
            this._repository.findMultipleDocuments(searchCriteria, (err) => {
                finishSingleUpdateCallback(err);
            }, (documentList: any[]) => {
                documentList.forEach(document => {
                    this.updateDocumentInMemory(document);
                });
                var promiseList = [];
                documentList.forEach(document => {
                    promiseList.push(this.updateDocumentInDatabase(document));
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