export enum ISOWeekDay {
	Monday = 1,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
	Sunday
}
export interface ISOWeekDayVM {
	iSOWeekDay: ISOWeekDay,
	name: string
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
	public getISOWeekDayVMList(): ISOWeekDayVM[] {
		return [
			{
				iSOWeekDay: ISOWeekDay.Monday,
				name: "Monday"
			},
			{
				iSOWeekDay: ISOWeekDay.Tuesday,
				name: "Tuesday"
			},
			{
				iSOWeekDay: ISOWeekDay.Wednesday,
				name: "Wednesday"
			},
			{
				iSOWeekDay: ISOWeekDay.Thursday,
				name: "Thursday"
			},
			{
				iSOWeekDay: ISOWeekDay.Friday,
				name: "Friday"
			},
			{
				iSOWeekDay: ISOWeekDay.Saturday,
				name: "Saturday"
			},
			{
				iSOWeekDay: ISOWeekDay.Sunday,
				name: "Sunday"
			}
		]
	}
}