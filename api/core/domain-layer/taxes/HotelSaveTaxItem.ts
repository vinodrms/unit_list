import {ThLogger, ThLogLevel} from '../../utils/logging/ThLogger';
import {ThError} from '../../utils/th-responses/ThError';
import {ThStatusCode} from '../../utils/th-responses/ThResponse';
import {AppContext} from '../../utils/AppContext';
import {SessionContext} from '../../utils/SessionContext';
import {HotelSaveTaxItemDO} from './HotelSaveTaxItemDO';
import {TaxResponseRepoDO} from '../../data-layer/taxes/repositories/ITaxRepository';
import {ValidationResultParser} from '../common/ValidationResultParser';
import {TaxDO} from '../../data-layer/taxes/data-objects/TaxDO';
import {TaxItemActionFactory} from './actions/TaxItemActionFactory';

export class HotelSaveTaxItem {
	private _taxItemDO: HotelSaveTaxItemDO;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
	}
	public save(taxItemDO: HotelSaveTaxItemDO): Promise<TaxDO> {
		this._taxItemDO = taxItemDO;
		return new Promise<TaxDO>((resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) => {
			try {
				this.saveCore(resolve, reject);
			} catch (error) {
				var thError = new ThError(ThStatusCode.HotelSaveTaxItemError, error);
				ThLogger.getInstance().logError(ThLogLevel.Error, "error saving tax item", this._taxItemDO, thError);
				reject(thError);
			}
		});
	}
	private saveCore(resolve: { (result: TaxDO): void }, reject: { (err: ThError): void }) {
		var validationResult = HotelSaveTaxItemDO.getValidationStructure().validateStructure(this._taxItemDO);
		if (!validationResult.isValid()) {
			var parser = new ValidationResultParser(validationResult, this._taxItemDO);
			parser.logAndReject("Error validating data for save tax item", reject);
			return;
		}
		var taxDO = this.buildTaxDO();
		if (!taxDO.isValid()) {
			var thError = new ThError(ThStatusCode.HotelSaveTaxItemValidationProblem, null);
			ThLogger.getInstance().logBusiness(ThLogLevel.Warning, "error validating tax item", this._taxItemDO, thError);
			reject(thError);
			return;
		}

		var actionFactory = new TaxItemActionFactory(this._appContext, this._sessionContext);
		var actionStrategy = actionFactory.getActionStrategy(taxDO);
		actionStrategy.save(resolve, reject);
	}
	private buildTaxDO(): TaxDO {
		var tax = new TaxDO();
		tax.buildFromObject(this._taxItemDO);
		tax.hotelId = this._sessionContext.sessionDO.hotel.id;
		return tax;
	}
}