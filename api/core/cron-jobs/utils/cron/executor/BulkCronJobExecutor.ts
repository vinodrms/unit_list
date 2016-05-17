import {ICronJobExecutor} from './ICronJobExecutor';

export class BulkCronJobExecutor implements ICronJobExecutor {

	constructor(private jobExecutorList: ICronJobExecutor[]) { }

	public execute() {
		this.jobExecutorList.forEach((jobExecutor: ICronJobExecutor) => {
			jobExecutor.execute();
		});
	}
}