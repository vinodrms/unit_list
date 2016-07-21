import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThAuditLogger} from '../../../utils/logging/ThAuditLogger';
import {JobExecutorDO} from '../../utils/cron/executor/JobExecutorDO';
import {ICronJobExecutor} from '../../utils/cron/executor/ICronJobExecutor';
import {MarkOccupiedCleanRoomsAsDirtyProcess} from '../../../domain-layer/hotel-operations/room/processes/MarkOccupiedCleanRoomsAsDirtyProcess';
import {RoomDO} from '../../../data-layer/rooms/data-objects/RoomDO';

import util = require('util');

export class MarkOccupiedCleanRoomsAsDirtyCronJobExecutor implements ICronJobExecutor {
    constructor(private _executorDO: JobExecutorDO) {
    }
    public execute() {
        var markOccupiedRoomsAsDirtyProcess = new MarkOccupiedCleanRoomsAsDirtyProcess(this._executorDO.appContext, this._executorDO.hotel);
        markOccupiedRoomsAsDirtyProcess.runProcess().then((updatedRoomList: RoomDO[]) => {
            this.auditLogForRooms(updatedRoomList);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.MarkOccupiedRoomsAsDirtyCronJobExecutorError, error);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "[Cron] Error marking rooms as dirty", { executorDO: this._executorDO }, thError);
        });
    }

    private auditLogForRooms(updatedRoomList: RoomDO[]) {
        if (updatedRoomList.length == 0) { return; }
        ThAuditLogger.getInstance().log({
            message: util.format("Marked %s rooms as dirty for hotel *%s*", updatedRoomList.length, this._executorDO.hotel.contactDetails.name)
        });
    }
}