import {ThLogger, ThLogLevel} from '../../../../../utils/logging/ThLogger';
import {ThError} from '../../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../../utils/th-responses/ThResponse';
import {MongoRepository, MongoErrorCodes, MongoSearchCriteria} from '../../../../common/base/MongoRepository';
import {MongoQueryBuilder} from '../../../../common/base/MongoQueryBuilder';
import {IRoomRepository, RoomMetaRepoDO, RoomItemMetaRepoDO, RoomSearchCriteriaRepoDO, RoomSearchResultRepoDO} from '../../IRoomRepository';
import {LazyLoadRepoDO, LazyLoadMetaResponseRepoDO} from '../../../../common/repo-data-objects/LazyLoadRepoDO';
import {RoomDO, RoomStatus} from '../../../data-objects/RoomDO';
import {RoomRepositoryHelper} from '../helpers/RoomRepositoryHelper';

export class MongoRoomEditOperationsRepository extends MongoRepository { 
    private _helper: RoomRepositoryHelper;
    
    constructor(roomsEntity: Sails.Model) {
        super(roomsEntity);
        this._helper = new RoomRepositoryHelper();
    }
    
    public addRoom(meta: RoomMetaRepoDO, room: RoomDO): Promise<RoomDO> {
        return new Promise<RoomDO>((resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) => {
            this.addRoomCore(meta, room, resolve, reject);
        });
    }
        
    private addRoomCore(meta: RoomMetaRepoDO, room: RoomDO, resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
        room.hotelId = meta.hotelId;
        room.versionId = 0;
        room.status = RoomStatus.Active;

        this.createDocument(room,
            (err: Error) => {
                this.logAndReject(err, reject, { meat: meta, addOnProduct: room }, ThStatusCode.RoomRepositoryErrorAddingRoom);
            },
            (createdRoom: Object) => {
                resolve(this._helper.buildRoomDOFrom(createdRoom));
            }
        );
    }

    public updateRoom(meta: RoomMetaRepoDO, itemMeta: RoomItemMetaRepoDO, room: RoomDO): Promise<RoomDO> {
        return this.findAndModifyRoom(meta, itemMeta, room);
    }

    public deleteRoom(meta: RoomMetaRepoDO, itemMeta: RoomItemMetaRepoDO): Promise<RoomDO> {
        return this.findAndModifyRoom(meta, itemMeta,
            {
                "status": RoomStatus.Deleted
            });
    }

    private findAndModifyRoom(roomMeta: RoomMetaRepoDO, roomItemMeta: RoomItemMetaRepoDO, updateQuery: Object): Promise<RoomDO> {
        return new Promise<RoomDO>((resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) => {
            this.findAndModifyRoomCore(roomMeta, roomItemMeta, updateQuery, resolve, reject);
        });
    }
    private findAndModifyRoomCore(roomMeta: RoomMetaRepoDO, roomItemMeta: RoomItemMetaRepoDO, updateQuery: any, resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
        updateQuery.$inc = { "versionId": 1 };
        var findQuery: Object = {
            "hotelId": roomMeta.hotelId,
            "id": roomItemMeta.id,
            "versionId": roomItemMeta.versionId
        };
        this.findAndModifyDocument(findQuery, updateQuery,
            () => {
                var thError = new ThError(ThStatusCode.RoomRepositoryProblemUpdatingRoom, null);
                ThLogger.getInstance().logBusiness(ThLogLevel.Info, "Problem updating room - concurrency", { roomMeta: roomMeta, roomItemMeta: roomItemMeta, updateQuery: updateQuery }, thError);
                reject(thError);
            },
            (err: Error) => {
                this.logAndReject(err, reject, { roomMeta: roomMeta, updateQuery: updateQuery }, ThStatusCode.RoomRepositoryErrorUpdatingRoom);
            },
            (updatedDBRoom: Object) => {
                var room: RoomDO = new RoomDO();
                room.buildFromObject(updatedDBRoom);
                resolve(room);
            }
        );
    }

    private logAndReject(err: Error, reject: { (err: ThError): void }, context: Object, defaultStatusCode: ThStatusCode) {
        var errorCode = this.getMongoErrorCode(err);
        if (errorCode == MongoErrorCodes.DuplicateKeyError) {
            var thError = new ThError(ThStatusCode.RoomRepositoryNameAlreadyExists, err);
            ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "Room name already exists", context, thError);
            reject(thError);
            return;
        }
        var thError = new ThError(defaultStatusCode, err);
        ThLogger.getInstance().logError(ThLogLevel.Error, "Error adding room", context, thError);
        reject(thError);
    }
}