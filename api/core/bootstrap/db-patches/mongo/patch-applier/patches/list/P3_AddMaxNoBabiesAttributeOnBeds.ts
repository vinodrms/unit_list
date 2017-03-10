import { ThError } from '../../../../../../utils/th-responses/ThError';
import { ATransactionalMongoPatch } from '../../utils/ATransactionalMongoPatch';
import { MongoPatchType } from '../MongoPatchType';
import { MongoUpdateMultipleDocuments } from '../../../../../../data-layer/common/base/mongo-utils/MongoUpdateMultipleDocuments';
import { BedAccommodationType } from '../../../../../../data-layer/common/data-objects/bed/BedDO';


import async = require("async");

export class P3_AddMaxNoBabiesAttributeOnBeds extends ATransactionalMongoPatch {

    public getPatchType(): MongoPatchType {
        return MongoPatchType.AddMaxNoBabiesAttributeOnBeds;
    }
    protected applyCore(resolve: { (result: boolean): void }, reject: { (err: ThError): void }) {
        this._bedRepository.updateMultipleDocuments({
            "accommodationType": BedAccommodationType.Any,
            "capacity.maxNoBabies": null
        },
            {
                "capacity.maxNoBabies": 0
            }, ((err: any) => {
                reject(err);
            }), ((noUpdatedAtCurrentStep: number) => {
                resolve(true);
            }));
    }
}