import {ICronJobScheduler} from './utils/cron/scheduler/ICronJobScheduler';
import {HotelHalfHourlyCronJob} from './jobs/HotelHalfHourlyCronJob';

export class CronJobInitializer implements ICronJobScheduler {
	public schedule() {
		this.scheduleHourlyJobs();
	}

	private scheduleHourlyJobs() {
		this.scheduleJobList([
			// new HotelHalfHourlyCronJob()
		]);
	}

	private scheduleJobList(jobList: ICronJobScheduler[]) {
		jobList.forEach((job: ICronJobScheduler) => {
			job.schedule();
		});
	}
}