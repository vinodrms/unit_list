import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {AllotmentDO, AllotmentStatus} from './data-objects/AllotmentDO';
import {AllotmentsDO} from './data-objects/AllotmentsDO';

@Injectable()
export class EagerAllotmentsService {
	constructor(private _appContext: AppContext) {
	}

	public getAllotments(allotmentStatus: AllotmentStatus, priceProductIdList: string[]): Observable<AllotmentsDO> {
		if (!priceProductIdList || priceProductIdList.length == 0) {
			return this.getEmptyResult();
		}
		return this._appContext.thHttp.post(ThServerApi.Allotments,
			{ searchCriteria: { priceProductIdList: priceProductIdList, status: allotmentStatus } }).map((resultObject: Object) => {
				var allotments = new AllotmentsDO();
				allotments.buildFromObject(resultObject);
				return allotments;
			});
	}
	private getEmptyResult(): Observable<AllotmentsDO> {
		return new Observable<AllotmentsDO>((serviceObserver: Observer<AllotmentsDO>) => {
			var allotments = new AllotmentsDO();
			allotments.allotmentList = [];
			serviceObserver.next(allotments);
			serviceObserver.complete();
		});
	}
}