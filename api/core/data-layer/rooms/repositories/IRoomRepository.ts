import {RoomDO} from '../data-objects/RoomDO';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../common/repo-data-objects/LazyLoadRepoDO';

export interface RoomMetaRepoDO {
	hotelId: string;
}
export interface RoomItemMetaRepoDO {
	id: string;
	versionId: number;
}
export interface RoomSearchCriteriaRepoDO {
	name?: string;
	categoryIdList?: string[];
}
export interface RoomSearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	roomList: RoomDO[];
}

export interface IRoomRepository {
    getRoomCategoryIdList(meta: RoomMetaRepoDO): Promise<string[]>;
    
	getRoomList(roomMeta: RoomMetaRepoDO, searchCriteria?: RoomSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<RoomSearchResultRepoDO>;
    getRoomListCount(meta: RoomMetaRepoDO, searchCriteria: RoomSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO>;
	getRoomById(roomMeta: RoomMetaRepoDO, roomId: string): Promise<RoomDO>;
    
    addRoom(meta: RoomMetaRepoDO, roomCategory: RoomDO): Promise<RoomDO>;
    updateRoom(meta: RoomMetaRepoDO, itemMeta: RoomItemMetaRepoDO, addOnProduct: RoomDO): Promise<RoomDO>;
	deleteRoom(meta: RoomMetaRepoDO, itemMeta: RoomItemMetaRepoDO): Promise<RoomDO>;
}