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
	getTaxById(taxMeta: TaxMetaRepoDO, taxId: string): Promise<TaxDO>;

	addTax(taxMeta: TaxMetaRepoDO, tax: TaxDO): Promise<TaxDO>;
	updateTax(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO, tax: TaxDO): Promise<TaxDO>;
	deleteTax(taxMeta: TaxMetaRepoDO, taxItemMeta: TaxItemMetaRepoDO): Promise<TaxDO>;
}