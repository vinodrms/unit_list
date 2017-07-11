import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../common/base/MongoQueryBuilder';
import {LazyLoadRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {HotelInventorySnapshotMetaRepoDO, HotelInventorySnapshotSearchCriteriaRepoDO,
    HotelInventorySnapshotSearchResultRepoDO, IHotelInventorySnapshotRepository} from '../IHotelInventorySnapshotRepository';
import {HotelInventorySnapshotDO} from '../../data-objects/HotelInventorySnapshotDO';

declare var sails: any;

export class MongoHotelInventorySnapshotRepository extends MongoRepository implements IHotelInventorySnapshotRepository {
    constructor() {
        var snapshotEntity = sails.models.hotelinventorysnapshotentity;
        super(snapshotEntity);
    }

    public addSnapshot(meta: HotelInventorySnapshotMetaRepoDO, snapshot: HotelInventorySnapshotDO): Promise<HotelInventorySnapshotDO> {
        return new Promise<HotelInventorySnapshotDO>((resolve: { (result: HotelInventorySnapshotDO): void }, reject: { (err: ThError): void }) => {
            this.addSnapshotCore(resolve, reject, meta, snapshot);
        });
    }
    private addSnapshotCore(resolve: { (result: HotelInventorySnapshotDO): void }, reject: { (err: ThError): void },
        meta: HotelInventorySnapshotMetaRepoDO, snapshot: HotelInventorySnapshotDO) {

        snapshot.hotelId = meta.hotelId;
        snapshot.versionId = 0;

        this.createDocument(snapshot,
            (err: Error) => {
                var errorCode = this.getMongoErrorCode(err);
                if (errorCode == MongoErrorCodes.DuplicateKeyError) {
                    var thError = new ThError(ThStatusCode.MongoHotelInventorySnapshotRepositoryDuplicate, err);
                    ThLogger.getInstance().logBusiness(ThLogLevel.Debug, "Snapshot already exists", context, thError);
                    reject(thError);
                    return;
                }
                var thError = new ThError(ThStatusCode.MongoHotelInventorySnapshotRepositoryError, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding snapshot", context, thError);
                reject(thError);
            },
            (snapshotObject: Object) => {
                var snapshot: HotelInventorySnapshotDO = new HotelInventorySnapshotDO();
                snapshot.buildFromObject(snapshotObject);
                resolve(snapshot);
            }
        );
    }

    public getSnapshotList(meta: HotelInventorySnapshotMetaRepoDO,
        searchCriteria?: HotelInventorySnapshotSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<HotelInventorySnapshotSearchResultRepoDO> {
        return new Promise<HotelInventorySnapshotSearchResultRepoDO>((resolve: { (result: HotelInventorySnapshotSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getSnapshotListCore(resolve, reject, meta, searchCriteria, lazyLoad);
        });
    }
    private getSnapshotListCore(resolve: { (result: HotelInventorySnapshotSearchResultRepoDO): void }, reject: { (err: ThError): void },
        meta: HotelInventorySnapshotMetaRepoDO, searchCriteria?: HotelInventorySnapshotSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO) {
        var mongoSearchCriteria: MongoSearchCriteria = {
            criteria: this.buildSearchCriteria(meta, searchCriteria),
            sortCriteria: { thDateUtcTimestamp: 1 },
            lazyLoad: lazyLoad
        }
        this.findMultipleDocuments(mongoSearchCriteria,
            (err: Error) => {
                var thError = new ThError(ThStatusCode.MongoHotelInventorySnapshotRepositoryErrorGettingSnapshots, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting snapshot list", { meta: meta, searchCriteria: searchCriteria }, thError);
                reject(thError);
            },
            (foundSnapshotList: Object[]) => {
                var snapshotList: HotelInventorySnapshotDO[] = [];
                foundSnapshotList.forEach((dbSnapshot: Object) => {
                    var snapshot: HotelInventorySnapshotDO = new HotelInventorySnapshotDO();
                    snapshot.buildFromObject(dbSnapshot);
                    snapshotList.push(snapshot);
                });
                resolve({
                    snapshotList: snapshotList,
                    lazyLoad: lazyLoad
                });
            }
        );
    }
    private buildSearchCriteria(meta: HotelInventorySnapshotMetaRepoDO, searchCriteria?: HotelInventorySnapshotSearchCriteriaRepoDO): Object {
        var mongoQueryBuilder = new MongoQueryBuilder();
        mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
        if (searchCriteria) {
            if (!this._thUtils.isUndefinedOrNull(searchCriteria.interval)) {
                mongoQueryBuilder.addCustomQuery("$and",
                    [
                        { "thDateUtcTimestamp": { $gte: searchCriteria.interval.start.getUtcTimestamp() } },
                        { "thDateUtcTimestamp": { $lte: searchCriteria.interval.end.getUtcTimestamp() } }
                    ]
                );
            }
            mongoQueryBuilder.addExactMatch("thDateUtcTimestamp", searchCriteria.thDateUtcTimestamp);
        }
        return mongoQueryBuilder.processedQuery;
    }
}