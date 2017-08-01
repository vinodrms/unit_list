import { MongoRepository, MongoErrorCodes, MongoSearchCriteria } from '../../../common/base/MongoRepository';
import { MongoQueryBuilder } from '../../../common/base/MongoQueryBuilder';
import { IRoomCategoryRepository, RoomCategoryMetaRepoDO, RoomCategoryItemMetaRepoDO, RoomCategorySearchResultRepoDO, RoomCategorySearchCriteriaMetaRepoDO } from '../IRoomCategoryRepository';
import { LazyLoadRepoDO, LazyLoadMetaResponseRepoDO } from '../../../common/repo-data-objects/LazyLoadRepoDO';
import { RoomCategoryDO, RoomCategoryStatus } from '../../data-objects/RoomCategoryDO';
import { RoomCategoryRepositoryHelper } from "./helpers/RoomCategoryRepositoryHelper";
import { MongoRoomCategoryReadOperationsRepository } from "./operations/MongoRoomCategoryReadOperationsRepository";
import { MongoRoomCategoryEditOperationsRepository } from "./operations/MongoRoomCategoryEditOperationsRepository";

import _ = require('underscore');

declare var sails: any;

export class MongoRoomCategoryRepository extends MongoRepository implements IRoomCategoryRepository {
    private _helper: RoomCategoryRepositoryHelper;

    private _readRepository: MongoRoomCategoryReadOperationsRepository;
    private _editRepository: MongoRoomCategoryEditOperationsRepository;

    constructor() {
        var roomCategoriesEntity = sails.models.roomcategoriesentity;
        super(roomCategoriesEntity);
        this._readRepository = new MongoRoomCategoryReadOperationsRepository(roomCategoriesEntity);
        this._editRepository = new MongoRoomCategoryEditOperationsRepository(roomCategoriesEntity);
    }

    public getRoomCategoryList(roomMeta: RoomCategoryMetaRepoDO, searchCriteria?: RoomCategorySearchCriteriaMetaRepoDO, lazyLoad?: LazyLoadRepoDO): Promise<RoomCategorySearchResultRepoDO> {
        return this._readRepository.getRoomCategoryList(roomMeta, searchCriteria, lazyLoad);
    }

    public getRoomCategoryById(roomCategoryMeta: RoomCategoryMetaRepoDO, roomCategoryId: string): Promise<RoomCategoryDO> {
        return this._readRepository.getRoomCategoryById(roomCategoryMeta, roomCategoryId);
    }

    public addRoomCategory(meta: RoomCategoryMetaRepoDO, roomCategory: RoomCategoryDO): Promise<RoomCategoryDO> {
        return this._editRepository.addRoomCategory(meta, roomCategory);
    }

    public updateRoomCategory(meta: RoomCategoryMetaRepoDO, itemMeta: RoomCategoryItemMetaRepoDO, roomCategory: RoomCategoryDO): Promise<RoomCategoryDO> {
        return this._editRepository.updateRoomCategory(meta, itemMeta, roomCategory);
    }

    public deleteRoomCategory(meta: RoomCategoryMetaRepoDO, itemMeta: RoomCategoryItemMetaRepoDO): Promise<RoomCategoryDO> {
        return this._editRepository.deleteRoomCategory(meta, itemMeta);
    }
}