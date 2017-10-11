import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { ThLogger, ThLogLevel } from '../../../../../../utils/logging/ThLogger';
import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ThStatusCode } from '../../../../../../utils/th-responses/ThResponse';
import { MongoRepository } from '../../../../../../data-layer/common/base/MongoRepository';

import _ = require('underscore');

declare var sails: any;


export class P11_AddBookingsIndexForYMPerformance extends ATransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddBookingsIndexForYMPerformance;
    }

    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        var mongoRepo = new MongoRepository(sails.models.bookingsentity);
        mongoRepo.getNativeMongoCollection().then((bookingsCollection: any) => {
            bookingsCollection.createIndex({"hotelId": 1, "startUtcTimestamp": 1, "endUtcTimestamp": 1, "confirmationStatus": 1}, {}, ((err, indexName) => {
                if (err || !indexName) {
                    var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, err);
                    ThLogger.getInstance().logError(ThLogLevel.Error, "Patch11 - Error add index to bookings collection", { step: "Bootstrap" }, thError);
                    reject(thError);
                    return;
                }
                resolve(true);
            }));
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.ErrorBootstrappingApp, error);
            ThLogger.getInstance().logError(ThLogLevel.Error, "Patch11 - Error getting native bookings collection", { step: "Bootstrap" }, thError);
            reject(thError);
        });
    }
}