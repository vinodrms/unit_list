import {ICronJob} from './utils/ICronJob';
import {AllotmentArchiverCronJob} from './jobs/allotment/AllotmentArchiverCronJob';

import _ = require('underscore');

export class CronJobInitializer implements ICronJob {
	public schedule() {
		this.scheduleHourlyJobs();
	}

	private scheduleHourlyJobs() {
		this.scheduleJobList([
			new AllotmentArchiverCronJob()
		]);
	}

	private scheduleJobList(jobList: ICronJob[]) {
		_.forEach(jobList, (job: ICronJob) => {
			job.schedule();
		});
	}
}