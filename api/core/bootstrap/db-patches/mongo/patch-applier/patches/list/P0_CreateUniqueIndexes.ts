import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { ThLogger, ThLogLevel } from '../../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../../utils/th-responses/ThResponse';
import { MongoRepository } from '../../../../../../data-layer/common/base/MongoRepository';

import _ = require('underscore');

enum IndexType {
    Unique,
    Text
}

interface IndexMetadataDO {
    entity: Sails.Model;
    fields: Object;
    type: IndexType;
}

export class P0_CreateUniqueIndexes extends ATransactionalMongoPatch {

    private _indexList: IndexMetadataDO[];

    constructor() {
        super();

        this._indexList = [];
        this._indexList.push({
            entity: sails.models.hotelsentity,
            fields: { "userList.email": 1 },
            type: IndexType.Unique
        });
        this._indexList.push({
            entity: sails.models.bedsentity,
            fields: { "hotelId": 1, "name": 1 },
            type: IndexType.Unique
        });
        this._indexList.push({
            entity: sails.models.taxesentity,
            fields: { "hotelId": 1, "name": 1 },
            type: IndexType.Unique
        });
        this._indexList.push({
            entity: sails.models.addonproductentity,
            fields: { "hotelId": 1, "name": 1 },
            type: IndexType.Unique
        });
        this._indexList.push({
            entity: sails.models.roomsentity,
            fields: { "hotelId": 1, "name": 1 },
            type: IndexType.Unique
        });
        this._indexList.push({
            entity: sails.models.roomcategoriesentity,
            fields: { "hotelId": 1, "displayName": 1 },
            type: IndexType.Unique
        });
        this._indexList.push({
            entity: sails.models.hotelconfigurationsentity,
            fields: { "hotelId": 1, "metadata.type": 1 },
            type: IndexType.Unique
        });
        this._indexList.push({
            entity: sails.models.priceproductsentity,
            fields: { "hotelId": 1, "name": 1 },
            type: IndexType.Unique
        });
        this._indexList.push({
            entity: sails.models.customersentity,
            fields: {
                "$**": "text"
            },
            type: IndexType.Text
        });
        this._indexList.push({
            entity: sails.models.hotelinventorysnapshotentity,
            fields: { "hotelId": 1, "thDateUtcTimestamp": 1 },
            type: IndexType.Unique
        });
    }
    public getPatchType(): MongoPatchType {
        return MongoPatchType.CreateUniqueIndexes;
    }

    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        async.map(this._indexList, this.createIndexAsync, ((err: any, result?: boolean[]) => {
            if (err || !result) {
                var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Patch0 - Error ensuring unique index.", { step: "Bootstrap" }, thError);
                reject(thError);
                return;
            }

            resolve(true);
        }));
    }

    private createIndexAsync(index: IndexMetadataDO, indexCreatedCallback: { (err: any, result?: boolean): void }) {
        var mongoRepo = new MongoRepository(index.entity);
        mongoRepo.getNativeMongoCollection().then((nativeHotelsCollection: any) => {
            var indexOptions = {};
            if (index.type == IndexType.Unique) {
                indexOptions = { unique: true };
            }
            nativeHotelsCollection.createIndex(index.fields, indexOptions, ((err, indexName) => {
                if (err || !indexName) {
                    var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "Patch0 - Error ensuring unique index " + index.fields + " for " + index.entity, { step: "Bootstrap" }, thError);
                    indexCreatedCallback(thError);
                    return;
                }
                indexCreatedCallback(null, true);
            }));
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Patch0 - Error getting native " + index.entity + " collection", { step: "Bootstrap" }, thError);
            indexCreatedCallback(thError);
        });
    }
}