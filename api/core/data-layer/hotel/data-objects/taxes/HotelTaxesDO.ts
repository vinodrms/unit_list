import {BaseDO} from '../../../common/base/BaseDO';
import {TaxDO} from '../../../common/data-objects/taxes/TaxDO';

export class HotelTaxesDO extends BaseDO {
	constructor() {
		super();
	}
	vats: TaxDO[];
	taxes: TaxDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.vats = [];
		this.forEachElementOf(this.getPropertyFromObject("vats", object), (vatObject: Object) => {
			var vatDO = new TaxDO();
			vatDO.buildFromObject(vatObject);
			this.vats.push(vatDO);
		});

		this.taxes = [];
		this.forEachElementOf(this.getPropertyFromObject("taxes", object), (taxObject: Object) => {
			var taxDO = new TaxDO();
			taxDO.buildFromObject(taxObject);
			this.taxes.push(taxDO);
		});
	}
}