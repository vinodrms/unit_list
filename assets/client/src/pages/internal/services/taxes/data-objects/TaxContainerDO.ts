import {BaseDO} from '../../../../../common/base/BaseDO';
import {TaxDO} from './TaxDO';

export class TaxContainerDO extends BaseDO {
	vatList: TaxDO[];
	otherTaxList: TaxDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.vatList = this.getTaxDOListFrom(object, "vatList");
		this.otherTaxList = this.getTaxDOListFrom(object, "otherTaxList");
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
}