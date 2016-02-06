import {BaseDO} from '../../../common/base/BaseDO';
import {VatDO} from '../../../common/data-objects/taxes/VatDO';
import {TaxDO} from '../../../common/data-objects/taxes/TaxDO';

export class HotelTaxesDO extends BaseDO {
	constructor() {
		super();
	}
	vats: VatDO[];
	taxes: TaxDO[];

	protected getPrimitivePropertyKeys(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.vats = [];
		this.forEachElementOf(object["vats"], (vatObject: Object) => {
			var vatDO = new VatDO();
			vatDO.buildFromObject(vatObject);
			this.vats.push(vatDO);
		});

		this.taxes = [];
		this.forEachElementOf(object["taxes"], (taxObject: Object) => {
			var taxDO = new TaxDO();
			taxDO.buildFromObject(taxObject);
			this.taxes.push(taxDO);
		});
	}
}