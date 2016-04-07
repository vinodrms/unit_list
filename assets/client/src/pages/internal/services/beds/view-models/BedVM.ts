import {BedDO} from '../data-objects/BedDO';
import {BedTemplateDO} from '../../common/data-objects/bed-template/BedTemplateDO';

export class BedVM {
    private _bed: BedDO;
    private _template: BedTemplateDO;
     
    constructor() {
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
    
    public buildPrototype(): BedVM {
		var copy = new BedVM();
		copy.bed = new BedDO();
        copy.bed.buildFromObject(this.bed);
        copy.template = new BedTemplateDO();
        copy.template.buildFromObject(this.template);
		return copy;
	}
}