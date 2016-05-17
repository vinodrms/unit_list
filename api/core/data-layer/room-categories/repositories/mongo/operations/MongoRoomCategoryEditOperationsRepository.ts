import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {IRoomCategoryRepository, RoomCategoryMetaRepoDO, RoomCategoryItemMetaRepoDO, RoomCategorySearchResultRepoDO, RoomCategorySearchCriteriaMetaRepoDO} from '../../IRoomCategoryRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import {RoomCategoryDO, RoomCategoryStatus} from '../../../data-objects/RoomCategoryDO';
import {RoomCategoryRepositoryHelper} from "../helpers/RoomCategoryRepositoryHelper";

export class MongoRoomCategoryEditOperationsRepository extends MongoRepository {
    private _helper: RoomCategoryRepositoryHelper;
    
    constructor(roomCategoriesEntity: Sails.Model) {
        super(roomCategoriesEntity);
        this._helper = new RoomCategoryRepositoryHelper();
    }
    4
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
        return this.findAndModifyRoomCategory(meta, itemMeta, 
			{
				"displayName": roomCategory.displayName,
                "bedConfig": roomCategory.bedConfig
			});
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
                var thError = new ThError(ThStatusCode.RoomCategoryRepositoryProblemUpdatingRoomCategory, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating room category - concurrency", { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (err: Error) => {
                this.logAndReject(err, reject, { meta: meta, itemMeta: itemMeta, updateQuery: updateQuery }, ThStatusCode.RoomCategoryRepositoryErrorUpdatingRoomCategory);
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