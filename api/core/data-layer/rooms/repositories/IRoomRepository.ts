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
}
export interface RoomSearchResultRepoDO {
	lazyLoad?: LazyLoadRepoDO;
	roomList: RoomDO[];
}

export interface IRoomRepository {
    getRoomCategoryIdList(meta: RoomMetaRepoDO): Promise<string[]>;
    
	getRoomList(roomMeta: RoomMetaRepoDO, searchCriteria?: RoomSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<RoomSearchResultRepoDO>;
	getRoomById(roomMeta: RoomMetaRepoDO, roomId: string): Promise<RoomDO>;
}