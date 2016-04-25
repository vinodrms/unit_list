export class TimeZoneDO {
    public name: string;
}

export interface ITimeZonesService {
	getAllAvailableTimeZones(): Promise<TimeZoneDO[]>;
}