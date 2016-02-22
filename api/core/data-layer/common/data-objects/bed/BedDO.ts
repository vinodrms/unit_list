import {BaseDO} from '../../base/BaseDO';

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
    templateId: string;
    name: string;
    size: BedSizeDO;
    maxNoAdults: number;
    maxNoChildren: number;
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["id", "templateId", "name", "maxNoAdults", "maxNoChildren"];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
        
        this.size = new BedSizeDO();
		this.size.buildFromObject(this.getPropertyFromObject("size", object));

    }
    
    public getUnits(): number {
        return 0;
    }
    
    public getSubUnits(): number {
        return 0;
    }
}