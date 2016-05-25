import {ThDateDO} from './ThDateDO';
import {ThHourDO} from './ThHourDO';
import {ThDateUtils} from './ThDateUtils';

export class ThTimestamp {
	private static StartOfDayHour = 0;
	private static StartOfDayMaxMinute = 30;

	private _thDateDO: ThDateDO;
	private _thHourDO: ThHourDO;

	private _thDateUtils: ThDateUtils;

	constructor() {
	}

	public get thDateDO(): ThDateDO {
		return this._thDateDO;
	}
	public set thDateDO(thDateDO: ThDateDO) {
		this._thDateDO = thDateDO;
	}
	public get thHourDO(): ThHourDO {
		return this._thHourDO;
	}
	public set thHourDO(thHourDO: ThHourDO) {
		this._thHourDO = thHourDO;
	}
    
    public toString(): string {
		// TODO
        return "";
    }
}