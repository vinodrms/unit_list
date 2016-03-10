import {RoomCategoryDO} from '../../room-categories/data-objects/RoomCategoryDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

export interface RoomCategoryMetaRepoDO {
    hotelId: string;
}

export interface RoomCategoryItemMetaRepoDO {
    id: string;
	versionId: number;
}

export interface RoomCategorySearchCriteriaMetaRepoDO {
    displayName?: string; 
    categoryIdList?: string[];         
}

export interface RoomCategorySearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	roomCategoryList: RoomCategoryDO[];
}

export interface IRoomCategoryRepository {
    getRoomCategoryList(roomCategoryMetaRepoDO: RoomCategoryMetaRepoDO, searchCriteria?: RoomCategorySearchCriteriaMetaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<RoomCategorySearchResultRepoDO>;
    getRoomCategoryById(roomCategoryMeta: RoomCategoryMetaRepoDO, roomCategoryId: string): Promise<RoomCategoryDO>;
    
    addRoomCategory(meta: RoomCategoryMetaRepoDO, roomCategory: RoomCategoryDO): Promise<RoomCategoryDO>;
    updateRoomCategory(meta: RoomCategoryMetaRepoDO, itemMeta: RoomCategoryItemMetaRepoDO, roomCategory: RoomCategoryDO): Promise<RoomCategoryDO>;
	deleteRoomCategory(meta: RoomCategoryMetaRepoDO, itemMeta: RoomCategoryItemMetaRepoDO): Promise<RoomCategoryDO>;
}