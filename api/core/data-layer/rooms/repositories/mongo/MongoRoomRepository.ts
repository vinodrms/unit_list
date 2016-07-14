import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../common/base/MongoQueryBuilder';
import {IRoomRepository, RoomMetaRepoDO, RoomItemMetaRepoDO, RoomSearchCriteriaRepoDO, RoomSearchResultRepoDO} from '../IRoomRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {RoomDO, RoomStatus} from '../../data-objects/RoomDO';
import {RoomRepositoryHelper} from './helpers/RoomRepositoryHelper';
import {MongoRoomReadOperationsRepository} from './operations/MongoRoomReadOperationsRepository';
import {MongoRoomEditOperationsRepository} from './operations/MongoRoomEditOperationsRepository';

export class MongoRoomRepository extends MongoRepository implements IRoomRepository {
    private _readRepository: MongoRoomReadOperationsRepository;
    private _editRepository: MongoRoomEditOperationsRepository;
    
    constructor() {
        var roomsEntity = sails.models.roomsentity; 
        super(roomsEntity);
        this._readRepository = new MongoRoomReadOperationsRepository(roomsEntity);
        this._editRepository = new MongoRoomEditOperationsRepository(roomsEntity);
    }
    
    public getUsedRoomCategoryIdList(meta: RoomMetaRepoDO): Promise<string[]> {
        return this._readRepository.getRoomCategoryIdList(meta);
    }

    public getRoomList(roomMeta: RoomMetaRepoDO, searchCriteria?: RoomSearchCriteriaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<RoomSearchResultRepoDO> {
        return this._readRepository.getRoomList(roomMeta, searchCriteria, lazyLoad);
    }
    
    public getRoomListCount(roomMeta: RoomMetaRepoDO, searchCriteria: RoomSearchCriteriaRepoDO): Promise<LazyLoadMetaResponseRepoDO> {
        return this._readRepository.getRoomListCount(roomMeta, searchCriteria);
    }
    
    public getRoomById(roomMeta: RoomMetaRepoDO, roomId: string): Promise<RoomDO> {
        return this._readRepository.getRoomById(roomMeta, roomId);
    }

    public addRoom(meta: RoomMetaRepoDO, room: RoomDO): Promise<RoomDO> {
        return this._editRepository.addRoom(meta, room);
    }

    public updateRoom(meta: RoomMetaRepoDO, itemMeta: RoomItemMetaRepoDO, room: RoomDO): Promise<RoomDO> {
        return this._editRepository.updateRoom(meta, itemMeta, room);
    }

    public deleteRoom(meta: RoomMetaRepoDO, itemMeta: RoomItemMetaRepoDO): Promise<RoomDO> {
        return this._editRepository.deleteRoom(meta, itemMeta);
    }
}