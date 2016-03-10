import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes} from '../../../../common/base/MongoRepository';
import {IBedRepository, BedMetaRepoDO, BedItemMetaRepoDO, BedSearchCriteriaRepoDO} from '../../IBedRepository';
import {BedDO, BedStatus} from '../../../../common/data-objects/bed/BedDO';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';

export class MongoBedEditOperationsRepository extends MongoRepository {
	constructor(bedEntity: Sails.Model) {
        super(bedEntity);
    }
	
    public addBed(bedMeta: BedMetaRepoDO, bed: BedDO): Promise<BedDO> {
        return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
            this.addBedCore(bedMeta, bed, resolve, reject);
        });
    }
    private addBedCore(bedMeta: BedMetaRepoDO, bed: BedDO, resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
        bed.hotelId = bedMeta.hotelId;
        bed.versionId = 0;
        bed.status = BedStatus.Active;
        this.createDocument(bed,
            (err: Error) => {
                this.logAndReject(err, reject, { bedMeta: bedMeta, bed: bed }, ThStatusCode.BedRepositoryErrorAddingBed);
            },
            (createdBed: Object) => {
                var bed: BedDO = new BedDO();
                bed.buildFromObject(createdBed);
                resolve(bed);
            }
        );
    }
    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var errorCode = this.getMongoErrorCode(err);
        if (errorCode == MongoErrorCodes.DuplicateKeyError) {
            var thError = new ThError(ThStatusCode.BedRepositoryNameAlreadyExists, err);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Bed name already exists", context, thError);
            reject(thError);
            return;
        }
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding bed", context, thError);
        reject(thError);
    }

    public updateBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, bed: BedDO): Promise<BedDO> {
        return this.findAndModifyBed(bedMeta, bedItemMeta, bed);
    }
    public deleteBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO): Promise<BedDO> {
        return this.findAndModifyBed(bedMeta, bedItemMeta,
            {
                "status": BedStatus.Deleted
            });
    }
    private findAndModifyBed(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, updateQuery: Object): Promise<BedDO> {
        return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
            this.findAndModifyBedCore(bedMeta, bedItemMeta, updateQuery, resolve, reject);
        });
    }
    private findAndModifyBedCore(bedMeta: BedMetaRepoDO, bedItemMeta: BedItemMetaRepoDO, updateQuery: any, resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
        updateQuery.$inc = { "versionId": 1 };
        var findQuery: Object = {
            "hotelId": bedMeta.hotelId,
            "id": bedItemMeta.id,
            "versionId": bedItemMeta.versionId
        };
        this.findAndModifyDocument(findQuery, updateQuery,
            () => {
                var thError = new ThError(ThStatusCode.BedRepositoryErrorUpdatingBed, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating bed - concurrency", { bedMeta: bedMeta, bedItemMeta: bedItemMeta, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (err: Error) => {
                this.logAndReject(err, reject, { bedMeta: bedMeta, updateQuery: updateQuery }, ThStatusCode.BedRepositoryErrorUpdatingBed);
            },
            (updatedDBBed: Object) => {
                var bed: BedDO = new BedDO();
                bed.buildFromObject(updatedDBBed);
                resolve(bed);
            }
        );
    }
}