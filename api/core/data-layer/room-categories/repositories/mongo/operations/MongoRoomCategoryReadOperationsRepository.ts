import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {IRoomCategoryRepository, RoomCategoryMetaRepoDO, RoomCategoryItemMetaRepoDO, RoomCategorySearchResultRepoDO, RoomCategorySearchCriteriaMetaRepoDO} from '../../IRoomCategoryRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import {RoomCategoryDO, RoomCategoryStatus} from '../../../data-objects/RoomCategoryDO';
import {RoomCategoryRepositoryHelper} from "../helpers/RoomCategoryRepositoryHelper";

export class MongoRoomCategoryReadOperationsRepository extends MongoRepository {
    private _helper: RoomCategoryRepositoryHelper;
    
    constructor(roomCategoriesEntity: Sails.Model) {
        super(roomCategoriesEntity);
        this._helper = new RoomCategoryRepositoryHelper();
    }
    
    public getRoomCategoryList(roomMeta: RoomCategoryMetaRepoDO, searchCriteria?: RoomCategorySearchCriteriaMetaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<RoomCategorySearchResultRepoDO> {
        return new Promise<RoomCategorySearchResultRepoDO>((resolve: { (result: RoomCategorySearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryListCore(resolve, reject, roomMeta, searchCriteria, lazyLoad);
        });
    }
    private getRoomCategoryListCore(resolve: { (result: RoomCategorySearchResultRepoDO): void }, reject: { (err: ThError): void }, meta: RoomCategoryMetaRepoDO, searchCriteria?: RoomCategorySearchCriteriaMetaRepoDO, lazyLoad?: LazyLoadRepoDO) {
        var mongoSearchCriteria: MongoSearchCriteria = {
            criteria: this.buildSearchCriteria(meta, searchCriteria),
            sortCriteria: { name: 1 },
            lazyLoad: lazyLoad
        }
        this.findMultipleDocuments(mongoSearchCriteria,
            (err: Error) => {
                var thError = new ThError(ThStatusCode.RoomCategoryRepositoryErrorGettingRoomCategoryList, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting room category list", { meta: meta, searchCriteria: searchCriteria }, thError);
                reject(thError);
            },
            (foundRoomList: Object[]) => {
                var roomList = this._helper.buildRoomCategoryListFrom(foundRoomList);
                resolve({
                    roomCategoryList: roomList,
                    lazyLoad: lazyLoad
                });
            }
        );
    }
    private buildSearchCriteria(meta: RoomCategoryMetaRepoDO, searchCriteria: RoomCategorySearchCriteriaMetaRepoDO): Object {
        var mongoQueryBuilder = new MongoQueryBuilder();
        mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
        mongoQueryBuilder.addExactMatch("status", RoomCategoryStatus.Active);
        
        if(searchCriteria) {
            if(searchCriteria.displayName) {
                mongoQueryBuilder.addExactMatch("displayName", searchCriteria.displayName);
            }
            if(searchCriteria.categoryIdList) {
                mongoQueryBuilder.addMultipleSelectOptionList("id", searchCriteria.categoryIdList);
            }
            if (!this._thUtils.isUndefinedOrNull(searchCriteria.bedIdList)) {
                mongoQueryBuilder.addMultipleSelectOptionList("bedConfig.bedMetaList.bedId", searchCriteria.bedIdList);    
            }
        }
        
        return mongoQueryBuilder.processedQuery;
    }

    public getRoomCategoryById(roomCategoryMeta: RoomCategoryMetaRepoDO, roomCategoryId: string): Promise<RoomCategoryDO> {
        return new Promise<RoomCategoryDO>((resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryByIdCore(roomCategoryMeta, roomCategoryId, resolve, reject);
        });
    }

    private getRoomCategoryByIdCore(roomCategoryMeta: RoomCategoryMetaRepoDO, roomCategoryId: string, resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) {
        this.findOneDocument({ "hotelId": roomCategoryMeta.hotelId, "id": roomCategoryId },
            () => {
                var thError = new ThError(ThStatusCode.RoomCategoryRepositoryRoomCategoryNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Room category not found", { roomCategoryMeta: roomCategoryMeta, roomCategoryId: roomCategoryId }, thError);
                reject(thError);
            },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.RoomCategoryRepositoryErrorGettingRoom, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting room category by id", { roomCategoryMeta: roomCategoryMeta, roomCategoryId: roomCategoryId }, thError);
                reject(thError);
            },
            (foundRoomCategory: Object) => {
                var roomCategory: RoomCategoryDO = new RoomCategoryDO();
                roomCategory.buildFromObject(foundRoomCategory);
                resolve(roomCategory);
            }
        );
    }

}