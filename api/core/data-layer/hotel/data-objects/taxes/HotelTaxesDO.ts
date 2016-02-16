import {BaseDO} from '../../../common/base/BaseDO';
import {TaxDO} from '../../../common/data-objects/taxes/TaxDO';

export class HotelTaxesDO extends BaseDO {
	constructor() {
		super();
	}
	vatList: TaxDO[];
	otherTaxList: TaxDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.vatList = [];
		this.forEachElementOf(this.getPropertyFromObject("vatList", object), (vatObject: Object) => {
			var vatDO = new TaxDO();
			vatDO.buildFromObject(vatObject);
			this.vatList.push(vatDO);
		});

		this.otherTaxList = [];
		this.forEachElementOf(this.getPropertyFromObject("otherTaxList", object), (taxObject: Object) => {
			var taxDO = new TaxDO();
			taxDO.buildFromObject(taxObject);
			this.otherTaxList.push(taxDO);
		});
	}
}