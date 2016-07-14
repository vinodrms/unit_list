import {DefaultDataBuilder} from '../../../../../db-initializers/DefaultDataBuilder';
import {ThDateIntervalDO} from '../../../../../../core/utils/th-dates/data-objects/ThDateIntervalDO';
import {ThTimestampDO} from '../../../../../../core/utils/th-dates/data-objects/ThTimestampDO';
import {ThDateUtils} from '../../../../../../core/utils/th-dates/ThDateUtils';
import {HotelOperationsQueryDO} from '../../../../../../core/domain-layer/hotel-operations/dashboard/utils/HotelOperationsQueryDO';

export class HotelDashboardOperationsTestHelper {
    private _thDateUtils: ThDateUtils;

    constructor() {
        this._thDateUtils = new ThDateUtils();
    }

    public getTodayToTomorrowInterval(testDataBuilder: DefaultDataBuilder): ThDateIntervalDO {
        var thTimestamp = this.getTimestampForTimezone(testDataBuilder.hotelDO.timezone);
        var startDate = thTimestamp.thDateDO;
        var endDate = this._thDateUtils.addDaysToThDateDO(startDate.buildPrototype(), 1);
        return ThDateIntervalDO.buildThDateIntervalDO(startDate, endDate);
    }
    public getQueryForToday(testDataBuilder: DefaultDataBuilder): HotelOperationsQueryDO {
        var query = new HotelOperationsQueryDO();
        query.referenceDate = this.getTimestampForTimezone(testDataBuilder.hotelDO.timezone).thDateDO;
        return query;
    }
    private getTimestampForTimezone(timezone: string): ThTimestampDO {
        return ThTimestampDO.buildThTimestampForTimezone(timezone);
    }
}