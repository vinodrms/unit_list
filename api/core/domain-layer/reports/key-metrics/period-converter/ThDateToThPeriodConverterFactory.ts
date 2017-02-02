import { ThDateDO } from '../../../../utils/th-dates/data-objects/ThDateDO';
import { ThPeriodDO, ThPeriodType } from './ThPeriodDO';
import { IThDateToThPeriodConverter } from './IThDateToThPeriodConverter';
import { ThDateUtils } from '../../../../utils/th-dates/ThDateUtils';

export class ThDateToThPeriodConverterFactory {
    public getConverter(type: ThPeriodType): IThDateToThPeriodConverter {
        switch (type) {
            case ThPeriodType.Month:
                return new ThDateToMonthThPeriodConverter();
            case ThPeriodType.Week:
                return new ThDateToWeekThPeriodConverter();
            default:
                return new ThDateToDayThPeriodConverter();
        }
    }
}

class ThDateToDayThPeriodConverter implements IThDateToThPeriodConverter {
    public convert(date: ThDateDO): ThPeriodDO {
        let period = new ThPeriodDO();
        period.dateStart = date;
        period.dateEnd = date;
        period.id = date.toString();
        period.displayString = period.id;
        period.type = ThPeriodType.Day;
        return period;
    }
}

class ThDateToWeekThPeriodConverter implements IThDateToThPeriodConverter {
    private _dateUtils: ThDateUtils;
    constructor () {
        this._dateUtils = new ThDateUtils();
    }
    public convert(date: ThDateDO): ThPeriodDO {
        let period = new ThPeriodDO();
        period.dateStart = this._dateUtils.startOf(date, "isoWeek");
        period.dateEnd = this._dateUtils.endOf(date, "isoWeek");
        period.id = period.dateStart.toString() + " - " + period.dateEnd.toString();
        period.displayString = period.id;
        period.type = ThPeriodType.Week;
        return period;
    }
}

class ThDateToMonthThPeriodConverter implements IThDateToThPeriodConverter {
    private _dateUtils: ThDateUtils;
    constructor () {
        this._dateUtils = new ThDateUtils();
    }
    public convert(date: ThDateDO): ThPeriodDO {
        let period = new ThPeriodDO();
        period.dateStart = this._dateUtils.startOf(date, "month");
        period.dateEnd = this._dateUtils.endOf(date, "month");
        period.id = period.dateStart.toString() + " - " + period.dateEnd.toString();
        period.displayString = period.id;
        period.type = ThPeriodType.Week;
        return period;
    }
}