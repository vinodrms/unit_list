import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {ThUtils} from '../../utils/ThUtils';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {RoomCategoryDO} from '../../data-layer/room-categories/data-objects/RoomCategoryDO';
import {RoomCategoryItemActionFactory} from './save-actions/RoomCategoryItemActionFactory';
import {SaveRoomCategoryItemDO} from './SaveRoomCategoryItemDO';

import _ = require("underscore");

export class SaveRoomCategoryItem {
    private _thUtils: ThUtils;
    private _roomCategoryDO: SaveRoomCategoryItemDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public save(roomCategoryDO: SaveRoomCategoryItemDO): Promise<RoomCategoryDO> {
        this._roomCategoryDO = roomCategoryDO;
        return new Promise<RoomCategoryDO>((resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) => {
            try {
                this.saveCore(resolve, reject);
            } catch (error) {
                var thError = new ThError(ThStatusCode.SaveRoomCategoryItemError, error);
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving room category", this._roomCategoryDO, thError);
                reject(thError);
            }
        });
    }
    private saveCore(resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) {
        var validationResult = SaveRoomCategoryItemDO.getValidationStructure().validateStructure(this._roomCategoryDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._roomCategoryDO);
            parser.logAndReject("Error validating data for save room category", reject);
            return;
        }

        this.saveRoomCategory().then((savedRoomCategory: RoomCategoryDO) => {
            resolve(savedRoomCategory);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.SaveRoomCategoryItemError, error);
            if (thError.isNativeError()) {
                ThLogger.getInstance().logError(ThLogLevel.Error, "error saving room category item", this._roomCategoryDO, thError);
            }
            reject(thError);
        });
    }

    private saveRoomCategory(): Promise<RoomCategoryDO> {
        return new Promise<RoomCategoryDO>((resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) => {
            this.saveRoomCategoryCore(resolve, reject);
        });
    }
    private saveRoomCategoryCore(resolve: { (result: RoomCategoryDO): void }, reject: { (err: ThError): void }) {
        var actionFactory = new RoomCategoryItemActionFactory(this._appContext, this._sessionContext);
        var actionStrategy = actionFactory.getActionStrategy(this.buildRoomCategoryDO());
        actionStrategy.save(resolve, reject);
    }

    private buildRoomCategoryDO(): RoomCategoryDO {
        var roomCategory = new RoomCategoryDO();
        roomCategory.buildFromObject(this._roomCategoryDO);
        roomCategory.hotelId = this._sessionContext.sessionDO.hotel.id;
        return roomCategory;
    }
}