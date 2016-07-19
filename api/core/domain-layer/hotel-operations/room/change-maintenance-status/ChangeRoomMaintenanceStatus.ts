import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {ValidationResultParser} from '../../../common/ValidationResultParser';
import {RoomDO, RoomMaintenanceStatus} from '../../../../data-layer/rooms/data-objects/RoomDO';
import {ChangeRoomMaintenanceStatusDO} from './ChangeRoomMaintenanceStatusDO';
import {DocumentActionDO} from '../../../../data-layer/common/data-objects/document-history/DocumentActionDO';

import _ = require('underscore');

export class ChangeRoomMaintenanceStatus {
    private _thUtils: ThUtils;
    private _inputRoomDO: ChangeRoomMaintenanceStatusDO;

    private _loadedRoom: RoomDO;

    constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
        this._thUtils = new ThUtils();
    }

    public changeStatus(inputRoomDO: ChangeRoomMaintenanceStatusDO): Promise<RoomDO> {
        this._inputRoomDO = inputRoomDO;
        return new Promise<RoomDO>((resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) => {
            this.changeStatusCore(resolve, reject);
        });
    }
    private changeStatusCore(resolve: { (result: RoomDO): void }, reject: { (err: ThError): void }) {
        var validationResult = ChangeRoomMaintenanceStatusDO.getValidationStructure().validateStructure(this._inputRoomDO);
        if (!validationResult.isValid()) {
            var parser = new ValidationResultParser(validationResult, this._inputRoomDO);
            parser.logAndReject("Error validating change room maintenance status fields", reject);
            return;
        }

        var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
        roomsRepo.getRoomById({ hotelId: this._sessionContext.sessionDO.hotel.id }, this._inputRoomDO.id)
            .then((loadedRoom: RoomDO) => {
                var updatedRoom = this.setMaintenanceValues(loadedRoom);

                var roomsRepo = this._appContext.getRepositoryFactory().getRoomRepository();
                return roomsRepo.updateRoom({ hotelId: this._sessionContext.sessionDO.hotel.id }, {
                    id: updatedRoom.id,
                    versionId: updatedRoom.versionId
                }, updatedRoom);
            }).then((updatedRoom: RoomDO) => {
                resolve(updatedRoom);
            }).catch((error: any) => {
                var thError = new ThError(ThStatusCode.ChangeRoomMaintenanceStatusError, error);
                if (thError.isNativeError()) {
                    ThLogger.getInstance().logError(ThLogLevel.Error, "error changing room maintenance status", this._sessionContext, thError);
                }
                reject(thError);
            });
    }

    private setMaintenanceValues(room: RoomDO): RoomDO {
        room.maintenanceStatus = this._inputRoomDO.maintenanceStatus;
        room.maintenanceMessage = this._inputRoomDO.maintenanceMessage;

        var maintenanceStatusString: string = room.getMaintenanceStatusDisplayString();
        var logMessage = "The room was marked as " + maintenanceStatusString;
        var logMessageParameterMap = {};
        if (!this._thUtils.isUndefinedOrNull(room.maintenanceMessage) && _.isString(room.maintenanceMessage) && room.maintenanceMessage.length > 0) {
            logMessage += " (%maintenanceMessage%)";
            logMessageParameterMap["maintenanceMessage"] = room.maintenanceMessage;
        }
        var maintenanceAction = DocumentActionDO.buildDocumentActionDO({
            actionParameterMap: logMessageParameterMap,
            actionString: logMessage,
            userId: this._sessionContext.sessionDO.user.id
        });
        room.logCurrentMaintenanceHistory(maintenanceAction);

        return room;
    }
}