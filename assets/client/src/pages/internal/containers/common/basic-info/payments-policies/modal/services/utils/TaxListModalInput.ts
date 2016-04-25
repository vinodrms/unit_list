import {TaxType} from '../../../../../../../services/taxes/data-objects/TaxDO';

export class TaxListModalInput {
	private _taxType: TaxType;
	public get taxType(): TaxType {
		return this._taxType;
	}
	public set taxType(taxType: TaxType) {
		this._taxType = taxType;
	}
}