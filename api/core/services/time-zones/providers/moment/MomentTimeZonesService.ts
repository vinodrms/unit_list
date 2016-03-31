import {ITimeZonesService} from '../../ITimeZonesService';
import {ThError} from '../../../../utils/th-responses/ThError';

import moment = require("moment");

export class MomentTimeZonesService implements ITimeZonesService {

    constructor() {

    }

    public getAllAvailableTimeZones(): Promise<string[]> {
        return new Promise<any>((resolve: { (timeZones: string[]): void }, reject: { (err: ThError): void }) => {
            this.getAllAvailableTimeZonesCore(resolve, reject);
        });
    }

    private getAllAvailableTimeZonesCore(resolve: { (timeZones: string[]): void }, reject: { (err: ThError): void }) {
        resolve(moment.tz.names());
    }
}