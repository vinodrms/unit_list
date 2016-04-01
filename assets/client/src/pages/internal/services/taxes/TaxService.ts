import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {AppContext, ThServerApi} from '../../../../common/utils/AppContext';
import {ARequestService} from '../common/ARequestService';
import {TaxContainerDO} from './data-objects/TaxContainerDO';
import {TaxDO} from './data-objects/TaxDO';

@Injectable()
export class TaxService extends ARequestService<TaxContainerDO> {
	constructor(private _appContext: AppContext) {
		super();
	}
	protected sendRequest(): Observable<Object> {
		return this._appContext.thHttp.get(ThServerApi.Taxes);
	}
	protected parseResult(result: Object): TaxContainerDO {
		var taxContainerDO: TaxContainerDO = new TaxContainerDO();
		taxContainerDO.buildFromObject(result["taxes"]);
		return taxContainerDO;
	}
	public getTaxContainerDO(): Observable<TaxContainerDO> {
		return this.getServiceObservable();
	}
	public saveTax(taxDO: TaxDO) {
		return this._appContext.thHttp.post(ThServerApi.TaxesSaveItem, { tax: taxDO }).map((taxObject: Object) => {
			this.updateServiceResult();
			
			var taxDO: TaxDO = new TaxDO();
			taxDO.buildFromObject(taxObject["tax"]);
			return taxDO;
		});
	}
}