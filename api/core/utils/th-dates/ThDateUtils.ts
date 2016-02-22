import moment = require('moment-timezone');

export class ThDateUtils {
	constructor() {
	}
	private getTimezoneList(): string[] {
		return moment.tz.names();
	}
	public isValidTimezone(timezone: string) {
		var timezoneList = this.getTimezoneList();
		return _.contains(timezoneList, timezone);
	}
}