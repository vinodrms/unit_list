import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../common/base/MongoQueryBuilder';
import {IRoomCategoryRepository, RoomCategoryMetaRepoDO, RoomCategoryItemMetaRepoDO, RoomCategorySearchResultRepoDO, RoomCategorySearchCriteriaMetaRepoDO} from '../IRoomCategoryRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {RoomCategoryDO} from '../../data-objects/RoomCategoryDO';
import {RoomCategoryRepositoryHelper} from "./helpers/RoomCategoryRepositoryHelper";

import _ = require('underscore');

export class MongoRoomCategoryRepository extends MongoRepository implements IRoomCategoryRepository {
	private _helper: RoomCategoryRepositoryHelper;
    
    constructor() {
        super(sails.models.roomsentity);
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
				var thError = new ThError(ThStatusCode.MongoAddOnProductRepositoryErrorGettingList, err);
				ThLogger.getInstance().logError(ThLogLevel.Error, "Error getting room list", { meta: meta, searchCriteria: searchCriteria }, thError);
				reject(thError);
			},
			(foundRoomList: Object[]) => {
				var roomList = this._helper.buildRoomCategoryListFrom(foundRoomList);
				resolve({
					roomList: roomList,
					lazyLoad: lazyLoad
				});
			}
		);
	}
    private buildSearchCriteria(meta: RoomCategoryMetaRepoDO, searchCriteria: RoomCategorySearchCriteriaMetaRepoDO): Object {
		var mongoQueryBuilder = new MongoQueryBuilder();
		mongoQueryBuilder.addExactMatch("hotelId", meta.hotelId);
		return mongoQueryBuilder.processedQuery;
	}
    
	public getRoomCategoryById(roomCategoryItemMeta: RoomCategoryItemMetaRepoDO): Promise<RoomCategoryDO> {
        return null;    
    }
}