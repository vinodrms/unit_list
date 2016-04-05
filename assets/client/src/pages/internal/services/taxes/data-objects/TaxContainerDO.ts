import {BaseDO} from '../../../../../common/base/BaseDO';
import {TaxDO} from './TaxDO';

export class TaxContainerDO extends BaseDO {
	private _allTaxes: TaxDO[];
	vatList: TaxDO[];
	otherTaxList: TaxDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.vatList = this.getTaxDOListFrom(object, "vatList");
		this.otherTaxList = this.getTaxDOListFrom(object, "otherTaxList");
		this._allTaxes = this.vatList.concat(this.otherTaxList);
	}
	private getTaxDOListFrom(object: Object, key: string): TaxDO[] {
		var taxList: TaxDO[] = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, key), (taxObject: Object) => {
			var taxDO = new TaxDO();
			taxDO.buildFromObject(taxObject);
			taxList.push(taxDO);
		});
		return taxList;
	}
	public filterTaxesByListOfIds(taxIdList: string[]): TaxDO[] {
		return _.filter(this._allTaxes, (tax: TaxDO) => {
			return _.contains(taxIdList, tax.id);
		});
	}
}