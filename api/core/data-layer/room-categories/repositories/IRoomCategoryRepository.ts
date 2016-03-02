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
   
}

export interface RoomCategorySearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	roomList: RoomCategoryDO[];
}

export interface IRoomCategoryRepository {
    getRoomCategoryList(roomCategoryMetaRepoDO: RoomCategoryMetaRepoDO): Promise<RoomCategorySearchResultRepoDO>;
	getRoomCategoryById(roomCategoryItemMeta: RoomCategoryItemMetaRepoDO): Promise<RoomCategoryDO>;
}