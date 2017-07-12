import * as _ from "underscore";

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
	private _isoWeekDayVMByWeekDay: { [index: number]: ISOWeekDayVM };

	constructor() {
		this._isoWeekDayVMByWeekDay = _.indexBy(this.getISOWeekDayVMList(), wdVM => { return wdVM.iSOWeekDay; });
	}

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
	public getISOWeekDayVM(iSOWeekDay: ISOWeekDay): ISOWeekDayVM {
		return this._isoWeekDayVMByWeekDay[iSOWeekDay];
	}
}