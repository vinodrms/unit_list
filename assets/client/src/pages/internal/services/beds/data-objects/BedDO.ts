import {BaseDO} from '../../../../../common/base/BaseDO';

export enum BedStatus {
	Active,
	Deleted
}

export enum BedStorageType {
	Stationary,
	Rollaway
}

export enum BedAccommodationType {
	AdultsAndChildren,
	Babies
}

export class BedSizeDO extends BaseDO {
    constructor() {
        super();
    }
    
    widthCm: number;
    lengthCm: number;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["widthCm", "lengthCm"];
    }
}

export class BedCapacityDO extends BaseDO {
    constructor() {
        super();
    }
    
    maxNoAdults: number;
    maxNoChildren: number;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["maxNoAdults", "maxNoChildren"];
    }

    public get possibleConfigurations(): BedCapacityDO[] {
        var configurations = [];
        
        for(var i = this.maxNoAdults; i >= 0; i--) {
            var possbileConfiguration = new BedCapacityDO();
            possbileConfiguration.maxNoAdults = i;
            possbileConfiguration.maxNoChildren = this.maxNoChildren + (this.maxNoAdults - i);
            configurations.push(possbileConfiguration);
        }

        return configurations;
    }
}

export class BedDO extends BaseDO {
    constructor() {
        super();
    }
    
    id: string;
    versionId: number;
    hotelId: string;
    bedTemplateId: string;
    storageType: BedStorageType;
    accommodationType: BedAccommodationType;
    name: string;
    size: BedSizeDO;
    capacity: BedCapacityDO;
    status: BedStatus;
	notes: string;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "bedTemplateId", "storageType", "accommodationType", "name", "status", "notes"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
        
        this.size = new BedSizeDO();
		this.size.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "size"));
        
        this.capacity = new BedCapacityDO();
		this.capacity.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "capacity"));

    }
    
    public getUnits(): number {
        return 0;
    }
    
    public getSubUnits(): number {
        return 0;
    }
}