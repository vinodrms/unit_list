import {SaveBedItemDO} from '../../../../../core/domain-layer/beds/SaveBedItemDO';
import {BedDO, BedStatus, BedSizeDO} from '../../../../../core/data-layer/common/data-objects/bed/BedDO';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';

import should = require('should');

export class BedsTestHelper {

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
    }

    public getBedItemDOWithInvalidTemplateId(): SaveBedItemDO {
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 120;
        bedSize.widthCm = 120;
        var bedTemplateId: string = "123";

        return {
            bedTemplateId: bedTemplateId,
            name: "King Size Type 1",
            maxNoAdults: 2,
            maxNoChildren: 2,
            status: BedStatus.Active,
            size: bedSize,
			notes: "very confortable bed"
        };
    }

    public getValidSaveBedItemDO(): SaveBedItemDO {
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 120;
        bedSize.widthCm = 120;
        var bedTemplateId: string;
        if (this._defaultDataBuilder.bedTemplateList && this._defaultDataBuilder.bedTemplateList.length > 2) {
            bedTemplateId = this._defaultDataBuilder.bedTemplateList[2].id;
        }

        return {
            bedTemplateId: bedTemplateId,
            name: "King Size Type 1",
            maxNoAdults: 2,
            maxNoChildren: 2,
            status: BedStatus.Active,
            size: bedSize,
			notes: "the most confortable bed"
        };
    }

    public getSaveBedItemDOFrom(bed: BedDO): SaveBedItemDO {
        var result = {
            bedTemplateId: bed.bedTemplateId,
            name: bed.name,
            size: bed.size,
            maxNoAdults: bed.maxNoAdults,
            maxNoChildren: bed.maxNoChildren,
            status: bed.status,
			notes: "nice bed"
        }
        result["id"] = bed.id;
        return result;
    }

    public validate(readBed: BedDO, createdBed: BedDO) {
        should.equal(readBed.bedTemplateId, createdBed.bedTemplateId);
        should.equal(readBed.name, createdBed.name);
        should.equal(readBed.size.widthCm, createdBed.size.widthCm);
        should.equal(readBed.size.lengthCm, createdBed.size.lengthCm);
        should.equal(readBed.maxNoAdults, createdBed.maxNoAdults);
        should.equal(readBed.maxNoChildren, createdBed.maxNoChildren);
    }
}