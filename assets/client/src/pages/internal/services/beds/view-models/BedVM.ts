import {BaseDO} from '../../../../../common/base/BaseDO';
import {BedDO, BedAccommodationType, BedStorageType} from '../data-objects/BedDO';
import {BedTemplateDO} from '../../common/data-objects/bed-template/BedTemplateDO';
import {RoomCategoryStatsDO} from '../../room-categories/data-objects/RoomCategoryStatsDO';
import {ConfigCapacityDO} from '../../common/data-objects/bed-config/ConfigCapacityDO';

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
    
    public get capacity(): ConfigCapacityDO {
        var maxAdults = 0, maxChildren = 0, maxBabies = 0;
        
        var configCapacity = new ConfigCapacityDO();
        if(this._bed.accommodationType === BedAccommodationType.Babies) {
            configCapacity.noBabies = 1;
            configCapacity.noAdults = 0;
            configCapacity.noChildren = 0;    
        }
        else {
            configCapacity.noAdults = this._bed.capacity.maxNoAdults;
            configCapacity.noChildren = this._bed.capacity.maxNoChildren;
            configCapacity.noBabies = 0;
        }
        
        return configCapacity;
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
    
    public get accommodatesBabies(): boolean {
        return this._bed.accommodationType === BedAccommodationType.Babies;
    }

    public get bedStorageTypeString(): string {
        if(this._bed.storageType === BedStorageType.Rollaway) {
            return "Rollaway";
        }
        return "Stationary";
    }
}                                                                                                                                                                                                                                 