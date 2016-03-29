import {AppContext} from '../../../utils/AppContext';
import {SessionContext} from '../../../utils/SessionContext';
import {ThUtils} from '../../../utils/ThUtils';
import {ITaxItemActionStrategy} from './ITaxItemActionStrategy';
import {TaxItemAddStrategy} from './strategies/TaxItemAddStrategy';
import {TaxItemUpdateStrategy} from './strategies/TaxItemUpdateStrategy';
import {TaxDO} from '../../../data-layer/taxes/data-objects/TaxDO';

export class TaxItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(taxDO: TaxDO): ITaxItemActionStrategy {
		if (this._thUtils.isUndefinedOrNull(taxDO.id)) {
			return new TaxItemAddStrategy(this._appContext, this._sessionContext, taxDO);
		}
		return new TaxItemUpdateStrategy(this._appContext, this._sessionContext, taxDO);
	}
}