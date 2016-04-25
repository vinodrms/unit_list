import {BaseDO} from '../../../../../common/base/BaseDO';

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
	bedTemplateId: string;
	name: string;
	size: BedSizeDO;
    maxNoAdults: number;
    maxNoChildren: number;
    status: BedStatus;
	notes: string;
    units: number;
    
	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "versionId", "bedTemplateId", "name", "maxNoAdults", "maxNoChildren", "status", "notes", "units"];
	}
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
        
        this.size = new BedSizeDO();
		this.size.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "size"));

    }
}