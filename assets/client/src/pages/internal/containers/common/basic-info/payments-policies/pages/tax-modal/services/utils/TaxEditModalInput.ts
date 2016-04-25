import {TaxDO} from '../../../../../../../../services/taxes/data-objects/TaxDO';

export class TaxEditModalInput {
	private _taxDO: TaxDO;
	private _ccyCode: string;

	constructor() {
	}

	public get taxDO(): TaxDO {
		return this._taxDO;
	}
	public set taxDO(taxDO: TaxDO) {
		this._taxDO = taxDO;
	}
	public get ccyCode(): string {
		return this._ccyCode;
	}
	public set ccyCode(ccyCode: string) {
		this._ccyCode = ccyCode;
	}
}