import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../common/base/MongoQueryBuilder';
import {IRoomRepository, RoomMetaRepoDO, RoomItemMetaRepoDO, RoomSearchCriteriaRepoDO, RoomSearchResultRepoDO} from '../IRoomRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {RoomDO, RoomStatus} from '../../data-objects/RoomDO';
import {RoomRepositoryHelper} from './helpers/RoomRepositoryHelper';

import _ = require('underscore');

export class MongoRoomRepository extends MongoRepository implements IRoomRepository {
	private _helper: RoomRepositoryHelper;
    
    constructor() {
        super(sails.models.roomsentity);
        this._helper = new RoomRepositoryHelper();
    }
    
    public getRoomList(roomMeta: RoomMetaRepoDO, searchCriteria: RoomSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<RoomSearchResultRepoDO> {
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
				var thError = new ThError(ThStatusCode.MongoAddOnProductRepositoryErrorGettingList, err);
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
		return mongoQueryBuilder.processedQuery;
	}
    
	public getRoomById(roomMeta: RoomMetaRepoDO, roomId: string): Promise<RoomDO> {
        return null;    
    }
}