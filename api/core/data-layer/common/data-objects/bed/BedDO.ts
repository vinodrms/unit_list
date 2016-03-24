import {BaseDO} from '../../base/BaseDO';

export enum BedStatus {
	Active,
	Deleted
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

export class BedDO extends BaseDO {
    constructor() {
        super();
    }
    
    id: string;
    versionId: number;
    hotelId: string;
    bedTemplateId: string;
    name: string;
    size: BedSizeDO;
    maxNoAdults: number;
    maxNoChildren: number;
    status: BedStatus;
	notes: string;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "versionId", "hotelId", "bedTemplateId", "name", "maxNoAdults", "maxNoChildren", "status", "notes"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
        
        this.size = new BedSizeDO();
		this.size.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "size"));

    }
    
    public getUnits(): number {
        return 0;
    }
    
    public getSubUnits(): number {
        return 0;
    }
}