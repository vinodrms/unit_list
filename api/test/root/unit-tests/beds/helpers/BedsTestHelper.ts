import {SaveBedItemDO} from '../../../../../core/domain-layer/beds/SaveBedItemDO';
import {BedDO, BedStatus, BedSizeDO, BedCapacityDO, BedAccommodationType, BedStorageType} from '../../../../../core/data-layer/common/data-objects/bed/BedDO';
import {DefaultDataBuilder} from '../../../../db-initializers/DefaultDataBuilder';

import should = require('should');

export class BedsTestHelper {

    constructor(private _defaultDataBuilder: DefaultDataBuilder) {
    }

    public getBedItemDOWithInvalidTemplateId(): SaveBedItemDO {
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 2;
        bedCapacity.maxNoChildren = 2;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 120;
        bedSize.widthCm = 120;
        var bedTemplateId: string = "123";

        return {
            bedTemplateId: bedTemplateId,
            name: "King Size Type 1",
            accommodationType: BedAccommodationType.AdultsAndChildren,
            storageType: BedStorageType.Stationary,
            capacity: bedCapacity,
            status: BedStatus.Active,
            size: bedSize,
			notes: "very confortable bed"
        };
    }
    
    public getBabyBedItemDOWithInvalidSizeAndCapacity(): SaveBedItemDO {
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 2;
        bedCapacity.maxNoChildren = 2;
        var bedSize = new BedSizeDO();
        bedSize.lengthCm = 120;
        bedSize.widthCm = 120;
        var bedTemplateId: string;
        if (this._defaultDataBuilder.bedTemplateList && this._defaultDataBuilder.bedTemplateList.length > 4) {
            bedTemplateId = this._defaultDataBuilder.bedTemplateList[4].id;
        }
        
        return {
            bedTemplateId: bedTemplateId,
            name: "Invalid Baby Crib",
            accommodationType: BedAccommodationType.Babies,
            storageType: BedStorageType.Rollaway,
            capacity: bedCapacity,
            status: BedStatus.Active,
            size: bedSize,
			notes: "very confortable bed"
        };
    }
    
    public getAdultsChildrenBedItemDOWithInvalidSizeAndCapacity(): SaveBedItemDO {
        
        var bedTemplateId: string;
        if (this._defaultDataBuilder.bedTemplateList && this._defaultDataBuilder.bedTemplateList.length > 3) {
            bedTemplateId = this._defaultDataBuilder.bedTemplateList[3].id;
        }
        
        
        
        return {
            bedTemplateId: bedTemplateId,
            name: "Invalid Size/Cap Adults Bed",
            accommodationType: BedAccommodationType.AdultsAndChildren,
            storageType: BedStorageType.Stationary,
            capacity: null,
            status: BedStatus.Active,
            size: null,
			notes: "very confortable bed"
        };
    }
    
    public getValidRollawayBabyBedItemDO(): SaveBedItemDO {
        var bedTemplateId: string;
        if (this._defaultDataBuilder.bedTemplateList && this._defaultDataBuilder.bedTemplateList.length > 4) {
            bedTemplateId = this._defaultDataBuilder.bedTemplateList[4].id;
        }
        
        return {
            bedTemplateId: bedTemplateId,
            name: "Baby Crib",
            accommodationType: BedAccommodationType.Babies,
            storageType: BedStorageType.Rollaway,
            capacity: null,
            status: BedStatus.Active,
            size: null,
			notes: "very confortable bed"
        };
    }
    
    public getValidSaveBedItemDO(): SaveBedItemDO {
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 2;
        bedCapacity.maxNoChildren = 2;
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
            accommodationType: BedAccommodationType.AdultsAndChildren,
            storageType: BedStorageType.Stationary,
            capacity:bedCapacity,
            status: BedStatus.Active,
            size: bedSize,
			notes: "the most confortable bed"
        };
    }

    public getSaveBedItemDOFrom(bed: BedDO): SaveBedItemDO {
        var bedCapacity = new BedCapacityDO();
        bedCapacity.maxNoAdults = 2;
        bedCapacity.maxNoChildren = 2;
        var result = {
            bedTemplateId: bed.bedTemplateId,
            name: bed.name,
            accommodationType: BedAccommodationType.AdultsAndChildren,
            storageType: BedStorageType.Stationary,
            size: bed.size,
            capacity: bedCapacity,
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
        should.equal(readBed.capacity.maxNoAdults, createdBed.capacity.maxNoAdults);
        should.equal(readBed.capacity.maxNoChildren, createdBed.capacity.maxNoChildren);
    }
}