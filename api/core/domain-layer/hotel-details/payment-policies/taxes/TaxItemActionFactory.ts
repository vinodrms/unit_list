import {AppContext} from '../../../../utils/AppContext';
import {SessionContext} from '../../../../utils/SessionContext';
import {ThUtils} from '../../../../utils/ThUtils';
import {ITaxItemActionStrategy} from './ITaxItemActionStrategy';
import {OtherTaxItemAddStrategy} from './strategies/OtherTaxItemAddStrategy';
import {OtherTaxItemUpdateStrategy} from './strategies/OtherTaxItemUpdateStrategy';
import {VatTaxItemAddStrategy} from './strategies/VatTaxItemAddStrategy';
import {VatTaxItemUpdateStrategy} from './strategies/VatTaxItemUpdateStrategy';
import {InvalidTaxItemActionStrategy} from './strategies/InvalidTaxItemActionStrategy';

export enum TaxItemType {
	Vat,
	OtherTax
}

export class TaxItemActionFactory {
	private _thUtils: ThUtils;

	constructor(private _appContext: AppContext, private _sessionContext: SessionContext) {
		this._thUtils = new ThUtils();
	}

	public getActionStrategy(itemType: TaxItemType, taxObject: Object): ITaxItemActionStrategy {
		switch (itemType) {
			case TaxItemType.Vat:
				if (this.taxObjectContainsId(taxObject)) {
					return new VatTaxItemUpdateStrategy(this._appContext, this._sessionContext, taxObject);
				}
				return new VatTaxItemAddStrategy(this._appContext, this._sessionContext, taxObject);
			case TaxItemType.OtherTax:
				if (this.taxObjectContainsId(taxObject)) {
					return new OtherTaxItemUpdateStrategy(this._appContext, this._sessionContext, taxObject);
				}
				return new OtherTaxItemAddStrategy(this._appContext, this._sessionContext, taxObject);
			default:
				return new InvalidTaxItemActionStrategy();
		}
	}

	private taxObjectContainsId(taxObject: Object): boolean {
		return !this._thUtils.isUndefinedOrNull(taxObject["id"]);
	}
}