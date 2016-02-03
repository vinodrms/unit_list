import {BaseDO} from '../../../common/base/BaseDO';
import {VatDO} from '../../../common/data-objects/taxes/VatDO';
import {TaxDO} from '../../../common/data-objects/taxes/TaxDO';

export class HotelTaxesDO extends BaseDO {
	constructor() {
		super();
	}
	vats: VatDO[];
	taxes: TaxDO[];

	protected getPrimitiveProperties(): string[] {
		return [];
	}
	public buildFromObject(object: Object) {
		super.buildFromObject(object);

		this.vats = [];
		for (var vatObject in object["vats"]) {
			var vatDO = new VatDO();
			vatDO.buildFromObject(vatObject);
			this.vats.push(vatDO);
		}

		this.taxes = [];
		for (var taxObject in object["taxes"]) {
			var taxDO = new TaxDO();
			taxDO.buildFromObject(taxObject);
			this.taxes.push(taxDO);
		}
	}
}