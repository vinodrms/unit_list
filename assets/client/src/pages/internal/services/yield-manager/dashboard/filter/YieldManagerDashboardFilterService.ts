import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {YieldGroupItemVM} from './view-models/YieldGroupItemVM';
import {YieldLevelItemVM} from './view-models/YieldLevelItemVM';

@Injectable()
export class YieldManagerDashboardFilterService {

	constructor() { }

	public getYieldGroups(): Observable<YieldGroupItemVM[]>{
		var yieldGroups: YieldGroupItemVM[];
		yieldGroups = [
			new YieldGroupItemVM("red", "red", "red"),
			new YieldGroupItemVM("yellow", "yellow", "yellow"),
			new YieldGroupItemVM("green", "green", "green"),
			new YieldGroupItemVM("blue", "blue", "blue"),
			new YieldGroupItemVM("gray", "gray", "gray"),
			new YieldGroupItemVM("brown", "brown", "brown"),
			new YieldGroupItemVM("violet", "violet", "violet"),
			new YieldGroupItemVM("orange", "orange", "orange"),
			new YieldGroupItemVM("olive", "olive", "olive"),
			new YieldGroupItemVM("purple", "purple", "purple")
		]

		return Observable.of(yieldGroups);
	}

	public getYieldLevels(): Observable<YieldLevelItemVM[]>{
		var yieldLevel: YieldLevelItemVM[];
		yieldLevel = [
			new YieldLevelItemVM("1", ".1"),
			new YieldLevelItemVM("2", ".2"),
			new YieldLevelItemVM("3", ".3"),
			new YieldLevelItemVM("4", ".4"),
			new YieldLevelItemVM("5", ".5"),
			new YieldLevelItemVM("6", ".6"),
			new YieldLevelItemVM("7", ".7"),
			new YieldLevelItemVM("8", ".8"),
			new YieldLevelItemVM("9", ".9"),
			new YieldLevelItemVM("10", ".10")
		]

		return Observable.of(yieldLevel);
	}
}