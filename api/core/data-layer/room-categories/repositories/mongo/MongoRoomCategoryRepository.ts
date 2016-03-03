import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../common/base/MongoQueryBuilder';
import {IRoomCategoryRepository, RoomCategoryMetaRepoDO, RoomCategoryItemMetaRepoDO, RoomCategorySearchResultRepoDO, RoomCategorySearchCriteriaMetaRepoDO} from '../IRoomCategoryRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../common/repo-data-objects/LazyLoadRepoDO';
import {RoomCategoryDO, RoomCategoryStatus} from '../../data-objects/RoomCategoryDO';
import {RoomCategoryRepositoryHelper} from "./helpers/RoomCategoryRepositoryHelper";

import _ = require('underscore');

export class MongoRoomCategoryRepository extends MongoRepository implements IRoomCategoryRepository {
    private _helper: RoomCategoryRepositoryHelper;

    constructor() {
        super(sails.models.roomcategoriesentity);
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

    public addRoomCategory(meta: RoomCategoryMetaRepoDO, roomCategory: RoomCategoryDO): Promise<RoomCategoryDO> {
        return new Promise<RoomCategoryDO>((resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) => {
            this.addRoomCategoryCore(meta, roomCategory, resolve, reject);
        });
    }

    private addRoomCategoryCore(meta: RoomCategoryMetaRepoDO, roomCategory: RoomCategoryDO, resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) {
        roomCategory.hotelId = meta.hotelId;
        roomCategory.versionId = 0;
        roomCategory.status = RoomCategoryStatus.Active;

        this.createDocument(roomCategory,
            (err: Error) => {
                this.logAndReject(err, reject, { meat: meta, roomCategory: roomCategory }, ThStatusCode.RoomCategoryRepositoryErrorAddingRoomCategory);
            },
            (createdRoomCategory: Object) => {
                resolve(this._helper.buildRoomCategoryDOFrom(createdRoomCategory));
            }
        );
    }

    public updateRoomCategory(meta: RoomCategoryMetaRepoDO, itemMeta: RoomCategoryItemMetaRepoDO, roomCategory: RoomCategoryDO): Promise<RoomCategoryDO> {
        return this.findAndModifyRoomCategory(meta, itemMeta, roomCategory);
    }

    public deleteRoomCategory(meta: RoomCategoryMetaRepoDO, itemMeta: RoomCategoryItemMetaRepoDO): Promise<RoomCategoryDO> {
        return this.findAndModifyRoomCategory(meta, itemMeta,
            {
                "status": RoomCategoryStatus.Deleted
            });
    }

    private findAndModifyRoomCategory(meta: RoomCategoryMetaRepoDO, itemMeta: RoomCategoryItemMetaRepoDO, updateQuery: Object): Promise<RoomCategoryDO> {
        return new Promise<RoomCategoryDO>((resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) => {
            this.findAndModifyRoomCategoryCore(meta, itemMeta, updateQuery, resolve, reject);
        });
    }
    private findAndModifyRoomCategoryCore(meta: RoomCategoryMetaRepoDO, itemMeta: RoomCategoryItemMetaRepoDO, updateQuery: any, resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) {
        updateQuery.$inc = { "versionId": 1 };
        var findQuery: Object = {
            "hotelId": meta.hotelId,
            "id": itemMeta.id,
            "versionId": itemMeta.versionId
        };
        this.findAndModifyDocument(findQuery, updateQuery,
            () => {
                var thError = new ThError(ThStatusCode.AddOnProductRepositoryProblemUpdatingAddOnProduct, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating room category - concurrency", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (err: Error) => {
                this.logAndReject(err, reject, { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, ThStatusCode.AddOnProductRepositoryErrorUpdatingAddOnProduct);
            },
            (updatedDBRoomCategoryProduct: Object) => {
                resolve(this._helper.buildRoomCategoryDOFrom(updatedDBRoomCategoryProduct));
            }
        );
    }

    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var errorCode = this.getMongoErrorCode(err);
        if (errorCode == MongoErrorCodes.DuplicateKeyError) {
            var thError = new ThError(ThStatusCode.RoomCategoryRepositoryNameAlreadyExists, err);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Room category name already exists for this hotel", context, thError);
            reject(thError);
            return;
        }
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding room category", context, thError);
        reject(thError);
    }
}