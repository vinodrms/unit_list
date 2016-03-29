import {ThLogger, ThLogLevel} from '../../../../utils/logging/ThLogger';
import {ThError} from '../../../../utils/th-responses/ThError';
import {ThStatusCode} from '../../../../utils/th-responses/ThResponse';
import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ITaxItemActionStrategy} from '../ITaxItemActionStrategy';
import {TaxDO} from '../../../../data-layer/taxes/data-objects/TaxDO';
import {TaxMetaRepoDO, TaxItemMetaRepoDO} from '../../../../data-layer/taxes/repositories/ITaxRepository';

export class TaxItemUpdateStrategy implements ITaxItemActionStrategy {
	private _taxMeta: TaxMetaRepoDO;
	private _loadedTax: TaxDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext, private _taxDO: TaxDO) {
		this._taxMeta = this.buildTaxMetaRepoDO()
	}

	public save(resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) {
		var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
		taxRepo.getTaxById(this._taxMeta, this._taxDO.id)
			.then((loadedTax: TaxDO) => {
				this._loadedTax = loadedTax;

				var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
				var itemMeta = this.buildTaxItemMetaRepoDO();

				return taxRepo.updateTax(this._taxMeta, itemMeta, this._taxDO);
			})
			.then((result: TaxDO) => {
				resolve(result);
			})
			.catch((error: any) => {
				var thError = new ThError(ThStatusCode.TaxItemUpdateStrategyErrorUpdating, error);
				if (thError.isNativeError()) {
					ThLogger.getInstance().logError(ThLogLevel.Error, "error updating tax item", this._taxDO, thError);
				}
				reject(thError);
			});
	}
	private buildTaxMetaRepoDO(): TaxMetaRepoDO {
		return {
			hotelId: this._sessionContext.sessionDO.hotel.id
		};
	}
	private buildTaxItemMetaRepoDO(): TaxItemMetaRepoDO {
		return {
			id: this._loadedTax.id,
			versionId: this._loadedTax.versionId
		};
	}
}