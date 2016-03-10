import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThUtils} from '../../../../../utils/ThUtils';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository} from '../../../../common/base/MongoRepository';
import {BedMetaRepoDO, BedSearchCriteriaRepoDO} from '../../IBedRepository';
import {BedDO, BedStatus} from '../../../../common/data-objects/bed/BedDO';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';

export class MongoBedReadOperationsRepository extends MongoRepository {
    constructor(bedEntity: Sails.Model) {
        super(bedEntity);
    }

	public getBedList(bedMeta: BedMetaRepoDO, searchCriteria?: BedSearchCriteriaRepoDO): Promise<BedDO[]> {
        return new Promise<BedDO[]>((resolve: { (result: BedDO[]): void }, reject: { (err: ThError): void }) => {
            this.getBedListCore(resolve, reject, bedMeta, searchCriteria);
        });
    }
    private getBedListCore(resolve: { (result: BedDO[]): void }, reject: { (err: ThError): void }, bedMeta: BedMetaRepoDO, searchCriteria?: BedSearchCriteriaRepoDO) {
        this.findMultipleDocuments({ criteria: this.buildSearchCriteria(bedMeta, searchCriteria) },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.BedRepositoryErrorGettingBedList, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting bed list.", bedMeta, thError);
                reject(thError);
            },
            (dbBedList: Array<Object>) => {
                var resultDO = this.getQueryResultDO(dbBedList);
                resolve(resultDO);
            }
        );
    }
    private getQueryResultDO(dbBedList: Array<Object>): BedDO[] {
        var bedList: BedDO[] = [];
        dbBedList.forEach((dbBed: Object) => {
            var bed = new BedDO();
            bed.buildFromObject(dbBed);
            bedList.push(bed);
        });
        return bedList;
    }

    public getBedById(bedMeta: BedMetaRepoDO, bedId: string): Promise<BedDO> {
        return new Promise<BedDO>((resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) => {
            this.getBedByIdCore(bedMeta, bedId, resolve, reject);
        });
    }
    private getBedByIdCore(bedMeta: BedMetaRepoDO, bedId: string, resolve: { (result: BedDO): void }, reject: { (err: ThError): void }) {
        this.findOneDocument({ "hotelId": bedMeta.hotelId, "id": bedId },
            () => {
                var thError = new ThError(ThStatusCode.BedRepositoryBedNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Bed not found", { bedMeta: bedMeta, bedId: bedId }, thError);
                reject(thError);
            },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.BedRepositoryErrorGettingBed, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting bed by id", { bedMeta: bedMeta, bedId: bedId }, thError);
                reject(thError);
            },
            (foundBed: Object) => {
                var bed: BedDO = new BedDO();
                bed.buildFromObject(foundBed);
                resolve(bed);
            }
        );
    }
    
    private buildSearchCriteria(meta: BedMetaRepoDO, searchCriteria: BedSearchCriteriaRepoDO): Object {
        var mongoQueryBuilder = new MongoQueryBuilder();
        mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
        mongoQueryBuilder.addExactMatch("status", BedStatus.Active);

        if (searchCriteria) {
            if (searchCriteria.bedIdList) {
                mongoQueryBuilder.addMultipleSelectOptionList("id", searchCriteria.bedIdList);
            }
        }
        
        return mongoQueryBuilder.processedQuery;
    }
}