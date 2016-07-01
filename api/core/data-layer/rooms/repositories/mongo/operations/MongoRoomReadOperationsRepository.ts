import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {IRoomRepository, RoomMetaRepoDO, RoomItemMetaRepoDO, RoomSearchCriteriaRepoDO, RoomSearchResultRepoDO} from '../../IRoomRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import {RoomDO, RoomStatus} from '../../../data-objects/RoomDO';
import {RoomRepositoryHelper} from '../helpers/RoomRepositoryHelper';

export class MongoRoomReadOperationsRepository extends MongoRepository {
    private _helper: RoomRepositoryHelper;
    
    constructor(roomsEntity: Sails.Model) {
        super(roomsEntity);
        this._helper = new RoomRepositoryHelper();
    }

    public getRoomCategoryIdList(meta: RoomMetaRepoDO): Promise<string[]> {
        return new Promise<string[]>((resolve: { (result: string[]): void }, reject: { (err: ThError): void }) => {
            this.getRoomCategoryIdListCore(resolve, reject, meta);
        });
    }

    private getRoomCategoryIdListCore(resolve: { (result: string[]): void }, reject: { (err: ThError): void }, meta: RoomMetaRepoDO) {
        var findQuery: Object = {
            "hotelId": meta.hotelId,
            "status": RoomStatus.Active
        };
        this.findDistinctDocumentFieldValues("categoryId", findQuery,
            (err: Error) => {
                var thError = new ThError(ThStatusCode.RoomRepositoryErrorReadingCategoryIdList, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error reading category id list for rooms", { meta: meta }, thError);
                reject(thError);
            },
            (distinctCategoryIdList: string[]) => {
                resolve(distinctCategoryIdList);
            }
        );
    }
    
    public getRoomListCount(meta: RoomMetaRepoDO, searchCriteria: RoomSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
		return new Promise<LazyLoadMetaResponseRepoDO>((resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }) => {
			this.getRoomListCountCore(resolve, reject, meta, searchCriteria);
		});
	}
	private getRoomListCountCore(resolve: { (result: LazyLoadMetaResponseRepoDO): void }, reject: { (err: ThError): void }, meta: RoomMetaRepoDO, searchCriteria: RoomSearchCriteriaRepoDO) {
		var query = this.buildSearchCriteria(meta, searchCriteria);
		return this.getDocumentCount(query,
			(err: Error) => {
				var thError = new ThError(ThStatusCode.RoomRepositoryErrorReadingDocumentCount, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error reading document count", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(meta: LazyLoadMetaResponseRepoDO) => {
				resolve(meta);
			});
	}
    
    public getRoomList(roomMeta: RoomMetaRepoDO, searchCriteria?: RoomSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<RoomSearchResultRepoDO> {
        return new Promise<RoomSearchResultRepoDO>((resolve: { (result: RoomSearchResultRepoDO): void }, reject: { (err: ThError): void }) => {
            this.getRoomListCore(resolve, reject, roomMeta, searchCriteria, lazyLoad);
        });
    }
    private getRoomListCore(resolve: { (result: RoomSearchResultRepoDO): void }, reject: { (err: ThError): void }, meta: RoomMetaRepoDO, searchCriteria: RoomSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO) {
        var mongoSearchCriteria: MongoSearchCriteria = {
            criteria: this.buildSearchCriteria(meta, searchCriteria),
            sortCriteria: { name: 1 },
            lazyLoad: lazyLoad
        }
        this.findMultipleDocuments(mongoSearchCriteria,
            (err: Error) => {
                var thError = new ThError(ThStatusCode.RoomRepositoryErrorGettingRoomList, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting room list", { meta: meta, searchCriteria: searchCriteria }, thError);
                reject(thError);
            },
            (foundRoomList: Object[]) => {
                var roomList = this._helper.buildRoomListFrom(foundRoomList);
                resolve({
                    roomList: roomList,
                    lazyLoad: lazyLoad
                });
            }
        );
    }
    private buildSearchCriteria(meta: RoomMetaRepoDO, searchCriteria: RoomSearchCriteriaRepoDO): Object {
        var mongoQueryBuilder = new MongoQueryBuilder();
        mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
        mongoQueryBuilder.addExactMatch("status", RoomStatus.Active);
        if (searchCriteria) {
            if (!this._thUtils.isUndefinedOrNull(searchCriteria.name)) {
                mongoQueryBuilder.addRegex("name", searchCriteria.name);
            }
            if (!this._thUtils.isUndefinedOrNull(searchCriteria.categoryIdList)) {
                mongoQueryBuilder.addMultipleSelectOptionList("categoryId", searchCriteria.categoryIdList);    
            }
            if (!this._thUtils.isUndefinedOrNull(searchCriteria.maintenanceStatusList)) {
                mongoQueryBuilder.addMultipleSelectOptionList("maintenanceStatus", searchCriteria.maintenanceStatusList);    
            }
        }
        return mongoQueryBuilder.processedQuery;
    }

    public getRoomById(roomMeta: RoomMetaRepoDO, roomId: string): Promise<RoomDO> {
        return new Promise<RoomDO>((resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) => {
            this.getRoomByIdCore(roomMeta, roomId, resolve, reject);
        });
    }
    private getRoomByIdCore(roomMeta: RoomMetaRepoDO, roomId: string, resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
        this.findOneDocument({ "hotelId": roomMeta.hotelId, "id": roomId },
            () => {
                var thError = new ThError(ThStatusCode.RoomRepositoryRoomNotFound, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Room not found", { roomMeta: roomMeta, roomId: roomId }, thError);
                reject(thError);
            },
            (err: Error) => {
                var thError = new ThError(ThStatusCode.RoomRepositoryErrorGettingRoom, err);
                ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting room by id", { roomMeta: roomMeta, roomId: roomId }, thError);
                reject(thError);
            },
            (foundRoom: Object) => {
                var room: RoomDO = new RoomDO();
                room.buildFromObject(foundRoom);
                resolve(room);
            }
        );
    }
}