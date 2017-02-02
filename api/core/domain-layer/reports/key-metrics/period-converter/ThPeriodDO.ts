import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';

export enum ThPeriodType {
    Day,
    Week,
    Month
}

export class ThPeriodDO {
    private _id: string;
    private _type: ThPeriodType;
    private _dateStart: ThDateDO;
    private _dateEnd: ThDateDO;
    private _displayString: string;

    public get id(): string {
        return this._id;
    }
    public set id(id: string) {
        this._id = id;
    }

    public get type(): ThPeriodType {
        return this._type;
    }
    public set type(type: ThPeriodType) {
        this._type = type;
    }

    public get dateStart(): ThDateDO {
        return this._dateStart;
    }
    public set dateStart(dateStart: ThDateDO) {
        this._dateStart = dateStart;
    }

    public get dateEnd(): ThDateDO {
        return this._dateEnd;
    }
    public set dateEnd(dateEnd: ThDateDO) {
        this._dateEnd = dateEnd;
    }

    public get displayString(): string {
        return this._displayString;
    }
    public set displayString(displayString: string) {
        this._displayString = displayString;
    }
}