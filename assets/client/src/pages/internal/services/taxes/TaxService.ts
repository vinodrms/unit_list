import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppContext, ThServerApi } from '../../../../common/utils/AppContext';
import { ARequestService } from '../common/ARequestService';
import { TaxContainerDO } from './data-objects/TaxContainerDO';
import { TaxDO } from './data-objects/TaxDO';

@Injectable()
export class TaxService extends ARequestService<TaxContainerDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get({
			serverApi: ThServerApi.Taxes
		});
	}
	protected parseResult(result: Object): TaxContainerDO {
		var taxContainerDO: TaxContainerDO = new TaxContainerDO();
		taxContainerDO.buildFromObject(result["taxes"]);
		return taxContainerDO;
	}
	public getTaxContainerDO(): Observable<TaxContainerDO> {
		return this.getServiceObservable();
	}
	public saveTax(taxDO: TaxDO): Observable<TaxDO> {
		return this._appContext.thHttp.post({
			serverApi: ThServerApi.TaxesSaveItem,
			body: JSON.stringify({
				tax: taxDO
			})
		}).map((taxObject: Object) => {
			this.updateServiceResult();

			var taxDO: TaxDO = new TaxDO();
			taxDO.buildFromObject(taxObject["tax"]);
			return taxDO;
		});
	}
}