import {UnitPalConfig} from '../../utils/environment/UnitPalConfig';
import {AppContext} from '../../utils/AppContext';
import {ICronJob} from './ICronJob';

import schedule = require('node-schedule');

export abstract class ACronJob implements ICronJob {
	constructor() {
	}

	public schedule() {
		schedule.scheduleJob(this.getRecurrenceRule(), () => {
			this.run();
		});
	}
	private run() {
		var unitPalConfig = new UnitPalConfig();
		var appContext = new AppContext(unitPalConfig);
		this.runCore(appContext);
	}

	protected abstract getRecurrenceRule(): schedule.RecurrenceRule;
	protected abstract runCore(appContext: AppContext);
}