import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { YieldFiltersDO } from './data-objects/YieldFiltersDO';
import { YieldFilterDO } from '../common/data-objects/yield-filter/YieldFilterDO';
import { YieldFilterValueDO } from '../common/data-objects/yield-filter/YieldFilterValueDO';

import * as _ from "underscore";

@Injectable()
export class YieldFiltersService extends ARequestService<YieldFiltersDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get({
			serverApi: ThServerApi.HotelConfigurationsYieldFilters
		});
	}
	protected parseResult(result: Object): YieldFiltersDO {
		var yieldFiltersDO: YieldFiltersDO = new YieldFiltersDO();
		yieldFiltersDO.buildFromObject(result["yieldFilterConfig"]);
		return yieldFiltersDO;
	}
	public getYieldFiltersDO(): Observable<YieldFiltersDO> {
		return this.getServiceObservable();
	}

	public saveYieldValue(filterId: string, yieldFilterValue: YieldFilterValueDO): Observable<YieldFilterValueDO> {
		var yieldFilterValueObject: Object = _.clone(yieldFilterValue);
		yieldFilterValueObject["filterId"] = filterId;

		return this._appContext.thHttp.post({
			serverApi: ThServerApi.HotelConfigurationsSaveYieldFilterValue,
			body: JSON.stringify({ 
				yieldFilterValue: yieldFilterValueObject 
			})
		}).map((yfValueObject: Object) => {
			this.updateServiceResult();

			var yieldFilterValue: YieldFilterValueDO = new YieldFilterValueDO();
			yieldFilterValue.buildFromObject(yfValueObject["yieldFilterValue"])
			return yieldFilterValue;
		});
	}
}