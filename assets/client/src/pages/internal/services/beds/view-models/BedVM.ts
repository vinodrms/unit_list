import {BaseDO} from '../../../../../common/base/BaseDO';
import {BedDO, BedAccommodationType} from '../data-objects/BedDO';
import {BedTemplateDO} from '../../common/data-objects/bed-template/BedTemplateDO';
import {RoomCategoryStatsDO, BedConfigCapacityDO} from '../../room-categories/data-objects/RoomCategoryStatsDO';

export class BedVM extends BaseDO {
    private _bed: BedDO;
    private _template: BedTemplateDO;
      
    constructor() {
        super();
    }
    
    protected getPrimitivePropertyKeys(): string[] {
        return [];
    }
    
    public buildFromObject(object: Object) {
		super.buildFromObject(object);
        
        this._bed = new BedDO();
		this._bed.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "bed"));
        
        this._template = new BedTemplateDO();
		this._template.buildFromObject(this.getObjectPropertyEnsureUndefined(object, "template"));
    }
    
    public get bed(): BedDO {
        return this._bed;
    }
    public set bed(bed: BedDO) {
        this._bed = bed;
    }
    
    public get template(): BedTemplateDO {
        return this._template;
    }
    public set template(template: BedTemplateDO) {
        this._template = template;
    }     
    
    public get capacity(): BedConfigCapacityDO {
        var maxAdults = 0, maxChildren = 0, maxBabies = 0;
        
        var bedConfigCapacity = new BedConfigCapacityDO();
        if(this._bed.accommodationType === BedAccommodationType.Babies) {
            bedConfigCapacity.maxNoBabies = 1;
            bedConfigCapacity.maxNoAdults = 0;
            bedConfigCapacity.maxNoChildren = 0;    
        }
        else {
            bedConfigCapacity.maxNoAdults = this._bed.capacity.maxNoAdults;
            bedConfigCapacity.maxNoChildren = this._bed.capacity.maxNoChildren;
            bedConfigCapacity.maxNoBabies = 0;
        }
        
        return bedConfigCapacity;
    }
    
    public get size(): string {
        if(!this._bed.size || !this._bed.size.widthCm || !this._bed.size.lengthCm) {
            return "-";    
        }
        
        return this._bed.size.widthCm + 'X' + this._bed.size.lengthCm;
    }
    
    public buildPrototype(): BedVM {
		var copy = new BedVM();
		copy.bed = new BedDO();
        copy.bed.buildFromObject(this.bed);
        copy.template = new BedTemplateDO();
        copy.template.buildFromObject(this.template);
		return copy;
	}
    
    public get accomodatesBabies(): boolean {
        return this._bed.accommodationType === BedAccommodationType.Babies;
    }
}                                                                                                                                                                                                                                 