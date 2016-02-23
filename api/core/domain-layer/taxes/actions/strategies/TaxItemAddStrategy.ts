import {ThError} from '../../../../utils/th-responses/ThError';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ITaxItemActionStrategy} from '../ITaxItemActionStrategy';
import {TaxDO} from '../../../../data-layer/taxes/data-objects/TaxDO';
import {TaxMetaRepoDO} from '../../../../data-layer/taxes/repositories/ITaxRepository';

export class TaxItemAddStrategy implements ITaxItemActionStrategy {
	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _taxDO: TaxDO) {
	}

	public save(resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) {
		var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
		var taxMeta = this.buildTaxMetaRepoDO();
		taxRepo.addTax(taxMeta, this._taxDO).then((result: TaxDO) => {
			resolve(result);
		}).catch((err: any) => {
			reject(err);
		});
	}
	private buildTaxMetaRepoDO(): TaxMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		};
	}
}