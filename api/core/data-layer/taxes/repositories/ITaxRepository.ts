import {TaxDO} from '../data-objects/TaxDO';


export interface TaxMetaRepoDO {
	hotelId: string;
}
export interface TaxItemMetaRepoDO {
	id: string;
	versionId: number;
}
export interface TaxResponseRepoDO {
	vatList: TaxDO[];
	otherTaxList: TaxDO[];
}

export interface ITaxRepository {
	getTaxList(taxMeta: TaxMetaRepoDO): Promise<TaxResponseRepoDO>;
	getTaxByIdAsync(taxMeta: TaxMetaRepoDO, taxId: string, finishGetTaxByIdCallback: { (err: any, response?: TaxDO): void; });

	addTax(taxMeta: TaxMetaRepoDO, tax: TaxDO): Promise<TaxDO>;
	updateTaxAsync(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO, tax: TaxDO, updateTaxCallback: { (err: any, response?: TaxDO): void; });
	deleteTaxAsync(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO, deleteTaxCallback: { (err: any, response?: TaxDO): void; });
}