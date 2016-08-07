import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThAuditLogger} from '../../../utils/logging/ThAuditLogger';
import {JobExecutorDO} from '../../utils/cron/executor/JobExecutorDO';
import {ICronJobExecutor} from '../../utils/cron/executor/ICronJobExecutor';
import {HotelInventorySnapshotProcess, InventorySnapshotProcessResult, InventorySnapshotType} from '../../../domain-layer/hotel-inventory-snapshots/processes/HotelInventorySnapshotProcess';

import util = require('util');

export class HotelInventorySnapshotCronJobExecutor implements ICronJobExecutor {
    constructor(private _executorDO: JobExecutorDO) {
    }

    public execute() {
        var snapshotProcess = new HotelInventorySnapshotProcess(this._executorDO.appContext, this._executorDO.hotel);
        snapshotProcess.createSnapshot(this._executorDO.thTimestamp).then((snapshotResult: InventorySnapshotProcessResult) => {
            this.auditLogForSnapshotResult(snapshotResult);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.HotelInventorySnapshotCronJobExecutorError, error);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "[Cron] Error creating inventory snapshot", { executorDO: this._executorDO }, thError);
        });
    }

    private auditLogForSnapshotResult(snapshotResult: InventorySnapshotProcessResult) {
        if (snapshotResult.type !== InventorySnapshotType.New) { return; }
        var noRooms = snapshotResult.snapshot.roomList.length;
        ThAuditLogger.getInstance().log({
            message: util.format("Created a snapshot for the inventory (%s rooms) for hotel *%s*", noRooms, this._executorDO.hotel.contactDetails.name)
        });
    }
}