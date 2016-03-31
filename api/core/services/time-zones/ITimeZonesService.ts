export interface ITimeZonesService {
	getAllAvailableTimeZones(): Promise<string[]>;
}