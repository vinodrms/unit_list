import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {RoomDO, RollawayBedStatus} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {ChangeRollawayBedStatusDO} from './ChangeRollawayBedStatusDO';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';

import _ = require('underscore');

export class ChangeRollawayBedStatus {
    private _thUtils: ThUtils;
    private _inputRoomDO: ChangeRollawayBedStatusDO;

    private _loadedRoom: RoomDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public changeStatus(inputRoomDO: ChangeRollawayBedStatusDO): Promise<RoomDO> {
        this._inputRoomDO = inputRoomDO;
        return new Promise<RoomDO>((resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) => {
            this.changeStatusCore(resolve, reject);
        });
    }
    private changeStatusCore(resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
        var validationResult = ChangeRollawayBedStatusDO.getValidationStructure().validateStructure(this._inputRoomDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._inputRoomDO);
            parser.logAndReject("Error validating change room rollaway status fields", reject);
            return;
        }

        var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
        roomsRepo.getRoomById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._inputRoomDO.id)
            .then((loadedRoom: RoomDO) => {
                var updatedRoom = this.setRollawayStatusValues(loadedRoom);

                var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
                return roomsRepo.updateRoom({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    id: updatedRoom.id,
                    versionId: updatedRoom.versionId
                }, updatedRoom);
            }).then((updatedRoom: RoomDO) => {
                resolve(updatedRoom);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.ChangeRollawayBedStatusError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing room rollaway bed status", this._sessionContext, thError);
                }
                reject(thError);
            });
    }

    private setRollawayStatusValues(room: RoomDO): RoomDO {
        room.rollawayBedStatus = this._inputRoomDO.rollawayBedStatus;
        var logMessage = this.getLogMessage();
        var rollawayAction = DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: {},
            actionString: logMessage,
            userId: this._sessionContext.sessionDO.user.id
        });
        room.logCurrentMaintenanceHistory(rollawayAction);
        return room;
    }
    private getLogMessage(): string {
        if (this._inputRoomDO.rollawayBedStatus === RollawayBedStatus.NoRollawayBeds) {
            return "Some rollaway beds were removed from the room";
        }
        return "Some rollaway beds were added in the room";
    }
}