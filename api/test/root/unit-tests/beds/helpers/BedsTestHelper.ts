import {SaveBedItemDO} from '../../../../../core/domain-layer/beds/SaveBedItemDO';
import {BedDO, BedStatus, BedSizeDO} from '../../../../../core/data-layer/common/data-objects/bed/BedDO';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';

import should = require('should');

export class BedsTestHelper {
	private static InvalidPercentageValue = 1.01;
    
    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
    }
    
	public getValidSaveBedItemDO(): SaveBedItemDO {
		var bedSize = new BedSizeDO();
        bedSize.lengthCm = 120;
        bedSize.widthCm = 120;
        var bedTemplateId: string; 
        if(this._defaultDataBuilder.bedTemplateList && this._defaultDataBuilder.bedTemplateList.length > 2) {
            bedTemplateId = this._defaultDataBuilder.bedTemplateList[2].id;
        }
        
        return {
			bedTemplateId: bedTemplateId,
            name: "King Size",
            maxNoAdults: 2,
            maxNoChildren: 2,
            status: BedStatus.Active,			
			size: bedSize
		};
	}
    
    public getSaveBedItemDOFrom(bed: BedDO): SaveBedItemDO {
        var result = {
            bedTemplateId: bed.bedTemplateId,
            name: bed.name,
            size: bed.size,
            maxNoAdults: bed.maxNoAdults,
            maxNoChildren: bed.maxNoChildren,
            status: bed.status
        }
        result["id"] = bed.id;
        return result;
    }
    
	// public getValidOtherTaxDO(): HotelSaveTaxItemDO {
	// 	return {
	// 		type: TaxType.OtherTax,
	// 		name: "Church Tax",
	// 		valueType: TaxValueType.Fixed,
	// 		value: 100.827
	// 	};
	// }

	// public validate(actualTax: TaxDO, oldTax: TaxDO) {
	// 	should.equal(actualTax.name, oldTax.name);
	// 	should.equal(actualTax.type, oldTax.type);
	// 	should.equal(actualTax.value, oldTax.value);
	// 	should.equal(actualTax.valueType, oldTax.valueType);
	// 	should.equal(actualTax.status, oldTax.status);
	// }
}