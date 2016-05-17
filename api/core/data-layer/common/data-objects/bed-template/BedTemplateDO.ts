import {BaseDO} from '../../base/BaseDO';
import {BedAccommodationType} from '../bed/BedDO';

export class BedTemplateDO extends BaseDO{
    constructor() {
		super();
	}
	id: string;
	name: string;
	iconUrl: string;
	accommodationType: BedAccommodationType;
	
	protected getPrimitivePropertyKeys(): string[] {
		return ["id", "name", "iconUrl", "accommodationType"];
	}
}