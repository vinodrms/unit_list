import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/combineLatest';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { AllotmentDO, AllotmentStatus } from './data-objects/AllotmentDO';
import { AllotmentsDO } from './data-objects/AllotmentsDO';

@Injectable()
export class EagerAllotmentsService {
	constructor(private _appContext: AppContext) {
	}

	public getAllotments(allotmentStatus: AllotmentStatus, customerId: string, priceProductIdList?: string[]): Observable<AllotmentsDO> {
		if (!priceProductIdList || priceProductIdList.length == 0) {
			return this.getEmptyResult();
		}
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.Allotments,
			body: JSON.stringify({
				searchCriteria: { customerId: customerId, priceProductIdList: priceProductIdList, status: allotmentStatus }
			})
		}).map((resultObject: Object) => {
			var allotments = new AllotmentsDO();
			allotments.buildFromObject(resultObject);
			return allotments;
		});
	}
	public getAllotmentById(allotmentId: string): Observable<AllotmentDO> {
		return this._appContext.thHttp.get({
			serverApi: ThServerApi.AllotmentItem,
			queryParameters: { id: allotmentId }
		}).map((allotmentObject: Object) => {
			var allotment = new AllotmentDO();
			allotment.buildFromObject(allotmentObject["allotment"]);
			return allotment;
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