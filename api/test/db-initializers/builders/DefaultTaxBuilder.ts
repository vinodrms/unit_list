import {TaxDO, TaxStatus, TaxType, TaxValueType} from '../../../core/data-layer/taxes/data-objects/TaxDO';
import {ThError} from '../../../core/utils/th-responses/ThError';
import {TaxResponseRepoDO} from '../../../core/data-layer/taxes/repositories/ITaxRepository';
import {TestContext} from '../../helpers/TestContext';

import async = require("async");

export interface ITaxDataSource {
	getTaxList(): TaxDO[];
}

export class DefaultTaxBuilder {
	constructor(private _testContext: TestContext) {
	}
	public getTaxList(): TaxDO[] {
		var taxList = [];
		taxList.push(DefaultTaxBuilder.buildTaxDO(this._testContext, "[Builder] Romanian VAT", TaxType.Vat, 0.2, TaxValueType.Percentage));
		taxList.push(DefaultTaxBuilder.buildTaxDO(this._testContext, "[Builder] City Tax", TaxType.OtherTax, 50, TaxValueType.Fixed));
		return taxList;
	}
	public static buildTaxDO(testContext: TestContext, name: string, taxType: TaxType, value: number, valueType: TaxValueType): TaxDO {
		var tax = new TaxDO();
		tax.hotelId = testContext.sessionContext.sessionDO.hotel.id;
		tax.name = name;
        tax.status = TaxStatus.Active;
		tax.type = taxType;
		tax.value = value;
		tax.valueType = valueType;
		return tax;
	}

	public loadTaxes(dataSource:ITaxDataSource, testContext: TestContext): Promise<TaxResponseRepoDO> {
		return new Promise<TaxResponseRepoDO>((resolve: { (result: TaxResponseRepoDO): void }, reject: { (err: ThError): void }) => {
			this.loadTaxesCore(resolve, reject, dataSource, testContext);
		});
	}
	private loadTaxesCore(resolve: { (result: TaxResponseRepoDO): void }, reject: { (err: ThError): void }, dataSource:ITaxDataSource, testContext: TestContext) {
		var taxIndex = 0;
		var taxList: TaxDO[] = dataSource.getTaxList();
		var addedTaxes: TaxDO[] = [];
		async.whilst(
			(() => {
				return taxIndex < taxList.length;
			}),
			((finishInsertSingleTaxCallback: any) => {
				var taxRepo = testContext.appContext.getRepositoryFactory().getTaxRepository();
				taxRepo.addTax({ hotelId: testContext.sessionContext.sessionDO.hotel.id }, taxList[taxIndex++]).then((result: TaxDO) => {
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