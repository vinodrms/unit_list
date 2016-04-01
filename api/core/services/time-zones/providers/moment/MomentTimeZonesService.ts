import {ITimeZonesService, TimeZoneDO} from '../../ITimeZonesService';
import {ThError} from '../../../../utils/th-responses/ThError';

import moment = require("moment");

export class MomentTimeZonesService implements ITimeZonesService {

    constructor() {
    }

    public getAllAvailableTimeZones(): Promise<TimeZoneDO[]> {
        return new Promise<any>((resolve: { (timeZoneList: TimeZoneDO[]): void }, reject: { (err: ThError): void }) => {
            this.getAllAvailableTimeZonesCore(resolve, reject);
        });
    }

    private getAllAvailableTimeZonesCore(resolve: { (timeZoneList: TimeZoneDO[]): void }, reject: { (err: ThError): void }) {
        var timeZoneList: TimeZoneDO[] = [];
        moment.tz.names().forEach(timeZoneName => {
            timeZoneList.push({ name: timeZoneName });
        });
        resolve(timeZoneList);
    }
}