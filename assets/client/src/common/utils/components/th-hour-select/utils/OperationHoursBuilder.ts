import {ThHourVM} from './ThHourVM';
import {ThHourDO} from '../../../../../pages/internal/services/common/data-objects/th-dates/ThHourDO';

export class OperationHoursBuilder {
	private _operationHoursList: ThHourVM[];

	constructor() {
		this.operationHoursList = [];
		var index = 0;
        for (var i = ThHourDO.MinHourOfDay; i <= ThHourDO.MaxHourOfDay; i++) {
            var firstThHour: ThHourDO = new ThHourDO();
            firstThHour.hour = i;
            firstThHour.minute = 0;
            var secondThHour: ThHourDO = new ThHourDO();
            secondThHour.hour = i;
            secondThHour.minute = 30;

            this.operationHoursList.push(new ThHourVM(firstThHour, index++));
            this.operationHoursList.push(new ThHourVM(secondThHour, index++));
        }
	}

	public get operationHoursList(): ThHourVM[] {
		return this._operationHoursList;
	}
	public set operationHoursList(operationHoursList: ThHourVM[]) {
		this._operationHoursList = operationHoursList;
	}

	public getInitialIndexFor(thHour: ThHourDO): number {
		var initialIndex = -1;
		this._operationHoursList.forEach((thHourVM: ThHourVM) => {
            if (thHour && this.equalHours(thHourVM.thHour, thHour))
                initialIndex = thHourVM.index;
        });
		return initialIndex;
	}
	private equalHours(hour1: ThHourDO, hour2: ThHourDO): boolean {
        return hour1.hour === hour2.hour && hour1.minute === hour2.minute;
    }
}