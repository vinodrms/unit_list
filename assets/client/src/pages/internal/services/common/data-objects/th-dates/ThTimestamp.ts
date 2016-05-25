import {ThDateDO} from './ThDateDO';
import {ThHourDO} from './ThHourDO';
import {ThDateUtils} from './ThDateUtils';

export class ThTimestamp {
	private _thDateDO: ThDateDO;
	private _thHourDO: ThHourDO;

	private _thDateUtils: ThDateUtils;

	constructor(private _timestamp: number) {
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
        return this._thDateDO.toString() + " " + this._thHourDO.toString();
    }
	
	public getTimeDistanceFromNowString(): string {
		return moment(this._timestamp).fromNow();
	}
}