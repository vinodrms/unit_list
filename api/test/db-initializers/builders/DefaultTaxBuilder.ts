import {TaxDO, TaxStatus, TaxType, TaxValueType} from '../../../core/data-layer/taxes/data-objects/TaxDO';
import {ThError} from '../../../core/utils/th-responses/ThError';
import {TaxResponseRepoDO} from '../../../core/data-layer/taxes/repositories/ITaxRepository';
import {AppContext} from '../../../core/utils/AppContext';

import async = require("async");

export class DefaultTaxBuilder {
	constructor(private _appContext: AppContext, private _hotelId: string) {
	}
	private getTaxList(): TaxDO[] {
		var taxList = [];

        var vatTax = new TaxDO();
		vatTax.hotelId = this._hotelId;
		vatTax.name = "[Builder] Romanian VAT";
        vatTax.status = TaxStatus.Active;
		vatTax.type = TaxType.Vat;
		vatTax.value = 0.2;
		vatTax.valueType = TaxValueType.Percentage;
		taxList.push(vatTax);

        var otherTax = new TaxDO();
		otherTax.hotelId = this._hotelId;
		otherTax.name = "[Builder] City Tax";
        otherTax.status = TaxStatus.Active;
		otherTax.type = TaxType.OtherTax;
		otherTax.value = 50;
		otherTax.valueType = TaxValueType.Fixed;
		taxList.push(otherTax);

		return taxList;
	}
	public loadTaxes(): Promise<TaxResponseRepoDO> {
		return new Promise<TaxResponseRepoDO>((resolve: { (result: TaxResponseRepoDO): void }, reject: { (err: ThError): void }) => {
			this.loadTaxesCore(resolve, reject);
		});
	}
	private loadTaxesCore(resolve: { (result: TaxResponseRepoDO): void }, reject: { (err: ThError): void }) {
		var taxIndex = 0;
		var taxList: TaxDO[] = this.getTaxList();
		var addedTaxes: TaxDO[] = [];
		async.whilst(
			(() => {
				return taxIndex < taxList.length;
			}),
			((finishInsertSingleTaxCallback: any) => {
				var taxRepo = this._appContext.getRepositoryFactory().getTaxRepository();
				taxRepo.addTax({ hotelId: this._hotelId }, taxList[taxIndex ++]).then((result: TaxDO) => {
					addedTaxes.push(result);
					finishInsertSingleTaxCallback(null, result);
				}).catch((error: any) => {
					finishInsertSingleTaxCallback(error);
				});
			}),
			((err: any) => {
				if (err) {
					reject(err);
				}
				else {
					var taxResponse: TaxResponseRepoDO = {
						vatList: _.filter(addedTaxes, (tax: TaxDO) => { return tax.type === TaxType.Vat }),
						otherTaxList: _.filter(addedTaxes, (tax: TaxDO) => { return tax.type === TaxType.OtherTax })
					}
					resolve(taxResponse);
				}
			})
		);
	}
}