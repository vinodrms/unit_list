import {HotelSaveTaxItemDO} from '../../../../../core/domain-layer/taxes/HotelSaveTaxItemDO';
import {TaxDO, TaxType, TaxValueType} from '../../../../../core/data-layer/taxes/data-objects/TaxDO';

import should = require('should');

export class HotelTaxesTestHelper {
	private static InvalidPercentageValue = 1.01;

	public getVatDOWithInvalidValueType(): HotelSaveTaxItemDO {
		var vat = this.getValidVatDO();
		vat.valueType = TaxValueType.Fixed;
		return vat;
	}
	public getVatDOWithInvalidValue(): HotelSaveTaxItemDO {
		var vat
         = this.getValidVatDO();
		vat.value = HotelTaxesTestHelper.InvalidPercentageValue;
		return vat;
	}

	public getValidVatDO(): HotelSaveTaxItemDO {
		return {
			type: TaxType.Vat,
			name: "Rooms VAT",
			valueType: TaxValueType.Percentage,
			value: 0.5
		};
	}
	public getHotelSaveTaxItemDOFrom(tax: TaxDO): HotelSaveTaxItemDO {
		var result: HotelSaveTaxItemDO = {
			name: tax.name,
			type: tax.type,
			value: tax.value,
			valueType: tax.valueType
		};
		result["id"] = tax.id;
		return result;
	}
	public getValidOtherTaxDO(): HotelSaveTaxItemDO {
		return {
			type: TaxType.OtherTax,
			name: "Church Tax",
			valueType: TaxValueType.Fixed,
			value: 100.82
		};
	}

	public validate(actualTax: TaxDO, oldTax: TaxDO) {
		should.equal(actualTax.name, oldTax.name);
		should.equal(actualTax.type, oldTax.type);
		should.equal(actualTax.value, oldTax.value);
		should.equal(actualTax.valueType, oldTax.valueType);
		should.equal(actualTax.status, oldTax.status);
	}
}