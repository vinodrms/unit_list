import {ThLogger, ThLogLevel} from '../../../utils/logging/ThLogger';
import {ThError} from '../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../utils/th-responses/ThResponse';
import {JobExecutorDO} from '../../utils/cron/executor/JobExecutorDO';
import {ICronJobExecutor} from '../../utils/cron/executor/ICronJobExecutor';
import {AllotmentDO} from '../../../data-layer/allotment/data-objects/AllotmentDO'
import {AllotmentArchiverProcess} from '../../../domain-layer/allotment/processes/AllotmentArchiverProcess'
import {ThNotification, ThNotificationCode} from '../../../services/notifications/ThNotification';

import _ = require('underscore');

export class AllotmentArchiverCronJobExecutor implements ICronJobExecutor {
	constructor(private _executorDO: JobExecutorDO) {
	}

	public execute() {
		var archiverProcess = new AllotmentArchiverProcess(this._executorDO.appContext, this._executorDO.hotel);
		archiverProcess.archive(this._executorDO.thTimestamp).then((archivedAllotmentList: AllotmentDO[]) => {
			this.sendNotificationsFor(archivedAllotmentList);
		}).catch((error: any) => {
			var thError = new ThError(ThStatusCode.AllotmentArchiverCronJobExecutorError, error);
			ThLogger.getInstance().logBusiness(ThLogLevel.Error, "[Cron] Error archiving allotmetns", { executorDO: this._executorDO }, thError);
		});
	}
	private sendNotificationsFor(archivedAllotmentList: AllotmentDO[]) {
		_.forEach(archivedAllotmentList, (archivedAllotment: AllotmentDO) => {
			var notification = new ThNotification(ThNotificationCode.AllotmentArchivedAutomatically, { period: archivedAllotment.openInterval.toString() }, this._executorDO.hotel.id);
			var notificationsService = this._executorDO.appContext.getServiceFactory().getNotificationService();
			notificationsService.sendNotification(notification).then((result: any) => { }).catch((error: any) => { });
		});
	}
}