import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {ThAuditLogger} from '../../../utils/logging/ThAuditLogger';
import {JobExecutorDO} from '../../utils/cron/executor/JobExecutorDO';
import {ICronJobExecutor} from '../../utils/cron/executor/ICronJobExecutor';
import {ThDateDO} from '../../../utils/th-dates/data-objects/ThDateDO';
import {ThDateUtils} from '../../../utils/th-dates/ThDateUtils';
import {HotelInventorySnapshotProcess, InventorySnapshotProcessResult, InventorySnapshotType} from '../../../domain-layer/hotel-inventory-snapshots/processes/HotelInventorySnapshotProcess';

import util = require('util');

export class HotelInventorySnapshotCronJobExecutor implements ICronJobExecutor {
    private _thDateUtils: ThDateUtils;

    constructor(private _executorDO: JobExecutorDO) {
        this._thDateUtils = new ThDateUtils();
    }

    public execute() {
        var yesterdayDate = this.getYesterdayThDate();
        var snapshotProcess = new HotelInventorySnapshotProcess(this._executorDO.appContext, this._executorDO.hotel);
        snapshotProcess.createSnapshot(yesterdayDate).then((snapshotResult: InventorySnapshotProcessResult) => {
            this.auditLogForSnapshotResult(snapshotResult);
        }).catch((error: any) => {
            var thError = new ThError(ThStatusCode.HotelInventorySnapshotCronJobExecutorError, error);
            ThLogger.getInstance().logBusiness(ThLogLevel.Error, "[Cron] Error creating inventory snapshot", { executorDO: this._executorDO }, thError);
        });
    }
    private getYesterdayThDate(): ThDateDO {
        var thDate: ThDateDO = this._executorDO.thTimestamp.thDateDO.buildPrototype();
        return this._thDateUtils.addDaysToThDateDO(thDate, -1);
    }

    private auditLogForSnapshotResult(snapshotResult: InventorySnapshotProcessResult) {
        if (snapshotResult.type !== InventorySnapshotType.New) { return; }
        var noRooms = snapshotResult.snapshot.roomList.length;
        ThAuditLogger.getInstance().log({
            message: util.format("Created a snapshot for the inventory (%s rooms) for hotel *%s*", noRooms, this._executorDO.hotel.contactDetails.name)
        });
    }
}