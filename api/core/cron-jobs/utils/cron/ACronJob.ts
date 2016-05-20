import {UnitPalConfig} from '../../../utils/environment/UnitPalConfig';
import {AppContext} from '../../../utils/AppContext';
import {ICronJobScheduler} from './scheduler/ICronJobScheduler';
import {ICronJobExecutor} from './executor/ICronJobExecutor';

import cron = require('cron');

export abstract class ACronJob implements ICronJobScheduler, ICronJobExecutor {
	constructor() {
	}

	public schedule() {
		var job = new cron.CronJob({
			cronTime: this.getRecurrenceRule(),
			onTick: () => {
				this.execute();
			},
			start: true,
			context: this
		});
	}
	public execute() {
		var unitPalConfig = new UnitPalConfig();
		var appContext = new AppContext(unitPalConfig);
		this.executeCore(appContext);
	}

	protected abstract getRecurrenceRule(): string;
	protected abstract executeCore(appContext: AppContext);
}