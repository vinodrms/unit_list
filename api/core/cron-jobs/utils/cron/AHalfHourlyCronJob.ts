import {ACronJob} from './ACronJob';

export abstract class AHalfHourlyCronJob extends ACronJob {
	private static HalfHourlyRule = "0 0,30 * * * *";

	protected getRecurrenceRule(): string {
		return AHalfHourlyCronJob.HalfHourlyRule;
	}
}