import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ARequestService } from '../../../../../../../../../../services/common/ARequestService';
import { AppContext, ThServerApi } from '../../../../../../../../../../../../common/utils/AppContext';

@Injectable()
export class EnableBookingDotComIntegrationService extends ARequestService<boolean> {

	private enabled:  boolean;

	constructor(private appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this.appContext.thHttp.post({
			serverApi: ThServerApi.EnableBookingDotComIntegration,
			body: JSON.stringify({
				enabled: this.enabled
			})
		});
	}
	protected parseResult(result: Object): boolean {
		return result["enabled"];
	}
	public setEnabled(enabled: boolean): Observable<boolean> {
		this.enabled = enabled;
		return this.getServiceObservable();
	}

	public refresh(enabled: boolean) {
		this.enabled = enabled;
		this.updateServiceResult();
	}
}