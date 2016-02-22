import {BaseDO} from '../../common/base/BaseDO';
import {BedDO} from '../../common/data-objects/bed/BedDO';

export class BedConfigurationDO extends BaseDO {
    constructor() {
        super();
    }
    
    hotelId: string;
    bedList: BedDO[];
    
    protected getPrimitivePropertyKeys(): string[] {
        return ["hotelId"];
    }
    
    public buildFromObject(object: Object) {
        super.buildFromObject(object);
        
        this.bedList = [];
		this.forEachElementOf(this.getObjectPropertyEnsureUndefined(object, "bedList"), (userObject: Object) => {
			var bedDO = new BedDO();
			bedDO.buildFromObject(userObject);
			this.bedList.push(bedDO);
		});   
    }
}