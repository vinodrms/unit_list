export enum ISOWeekDay {
	Monday = 1,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
	Sunday
}

export class ISOWeekDayUtils {
	public getISOWeekDayList(): ISOWeekDay[] {
		return [
			ISOWeekDay.Monday,
			ISOWeekDay.Tuesday,
			ISOWeekDay.Wednesday,
			ISOWeekDay.Thursday,
			ISOWeekDay.Friday,
			ISOWeekDay.Saturday,
			ISOWeekDay.Sunday
		];
	}
}